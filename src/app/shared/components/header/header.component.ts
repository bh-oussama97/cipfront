import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faLightbulb } from '@fortawesome/free-regular-svg-icons';
import { faArrowRightFromBracket,faCircleUser, faGear, faUser } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { IdeaService } from '../../services/idea.service';
import { TaskDto } from '../../interfaces/task-dto';
import { GetTasksListResponse } from '../../interfaces/get-tasks-list-response';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';
import {DateTime} from 'luxon';
import { DataService } from '../../services/data.service';
import { UserDto } from '../../interfaces/user-dto';
import { Profile } from '../../enum/profile';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit{
faCircleUser = faCircleUser;
faUser = faUser;
faSettings = faGear;
faLogout = faArrowRightFromBracket;
faBrightLamp = faLightbulb;
connectedUserRole:string;
notificationsCount:number;
notifsPreview:TaskDto[];
loggedInUser:UserDto;
fullName:string;
  constructor(private translate: TranslateService,
    private router:Router,private ideaService : IdeaService,private authService : AuthService,
  private dataService:DataService
  ){
  
  }
  ngOnInit(): void {
    //  this.loggedInUser = jwtDecode(localStorage.getItem('cip_token'));    
    this.loggedInUser = JSON.parse(localStorage.getItem('userJson'));
    this.fullName = this.loggedInUser.email.split('@')[0].split('.')[0].toLocaleUpperCase() + " "  +this.loggedInUser.email.split('@')[0].split('.')[1].toLocaleUpperCase();
    this.connectedUserRole = this.loggedInUser['roles'];
    this.refreshTasksByMatricule(this.loggedInUser['matricule']);
    this.dataService.taskCompletion$.subscribe(() => {
      this.refreshTasksByMatricule(this.loggedInUser['matricule']);
    });
  }

  refreshTasksByMatricule(matricule:string){
        this.ideaService.getListOfIdeasAffectedByRegistrationNumber(matricule).subscribe(
      (response:GetTasksListResponse)=>{
      this.notificationsCount = response.tasks.length;
      this.notifsPreview = response.tasks.map(task=>  {
        return {
          createdAt : DateTime.fromISO(task.createdAt).toFormat("dd/MM/yyyy hh:mm a"),
          ideaNumber : task.sequence,
          ideaId : task.ideaId,
          line : task.line,
          fullName : task.fullName,
          description : task.description,
          status : task.status,
          segment : task.segment,
          employee : task.employee,
          motif : task.motif,
          type:task.type,
          phone : task.phone,
          responsables : task.responsables
        }
      }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    });
  }

  useLanguage(language: string): void {
    this.translate.use(language);
}

  logout(){
    localStorage.clear();
    this.router.navigate(['/login']);
  }
  goToSettings(){
    this.router.navigate(['/settings']);
  }
  goToProfile(){
    this.router.navigate(['/profile']);
  }

  goToIdeaDetails(notif:TaskDto)
  {
    if(this.loggedInUser.roles === Profile.CHEF_SEGMENT)
    {
      this.dataService.transfertObject(notif);
      this.router.navigateByUrl('dashboard/ideas/selection');
    }
    if(this.loggedInUser.roles === Profile.CONTRE_MAITRE)
    {
      this.dataService.transfertObject(notif);
      this.router.navigateByUrl('dashboard/ideas/preselection');
    }
    if(this.loggedInUser.roles === Profile.EXPERT)
    {
      this.dataService.transfertObject(notif);
      this.router.navigateByUrl('dashboard/ideas/execution');
    }
  }
}
