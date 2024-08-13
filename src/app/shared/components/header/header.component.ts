import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faLightbulb } from '@fortawesome/free-regular-svg-icons';
import {
  faArrowRightFromBracket,
  faCircleUser,
  faGear,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { IdeaService } from '../../services/idea.service';
import { TaskDto } from '../../interfaces/task-dto';
import { GetTasksListResponse } from '../../interfaces/get-tasks-list-response';
import { DateTime } from 'luxon';
import { DataService } from '../../services/data.service';
import { UserDto } from '../../interfaces/user-dto';
import { Profile } from '../../enum/profile';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit,OnDestroy {
  faCircleUser = faCircleUser;
  faUser = faUser;
  faSettings = faGear;
  faLogout = faArrowRightFromBracket;
  faBrightLamp = faLightbulb;
  connectedUserRole: string;
  notificationsCount: number = 0;
  notifsPreview: TaskDto[];
  loggedInUser: UserDto;
  fullName: string;
  taskCompletionSubscription : Subscription;
  constructor(
    private translate: TranslateService,
    private router: Router,
    private ideaService: IdeaService,
    private dataService: DataService,
    private authService : AuthService
  ) {}
  ngOnInit(): void {
    this.loggedInUser = this.authService.get_login_info();
    this.connectedUserRole = this.loggedInUser['roles'];
    this.fullName =
      this.loggedInUser.email.split('@')[0].split('.')[0].toLocaleUpperCase() +
      ' ' +
      this.loggedInUser.email.split('@')[0].split('.')[1].toLocaleUpperCase();
    this.refreshTasksByMatricule(this.loggedInUser['matricule']);
    this.taskCompletionSubscription =this.dataService.taskCompletion$.subscribe(() => {
      this.refreshTasksByMatricule(this.loggedInUser['matricule']);
    });
  }

  refreshTasksByMatricule(matricule: string) {
    this.ideaService
      .getListOfIdeasAffectedByRegistrationNumber(matricule)
      .subscribe((response: GetTasksListResponse) => {
        this.notificationsCount = response.tasks.length;
        this.notifsPreview = response.tasks
          .map((task) => {
            return {
              createdAt:  DateTime.fromISO(task.createdAt,{zone:'utc'}).setZone('Africa/Tunis').toFormat("dd/MM/yyyy hh:mm a"),
              ideaNumber: task.sequence,
              ideaId: task.ideaId,
              line: task.line,
              fullName: task.fullName,
              description: task.description,
              status: task.status,
              segment: task.segment,
              employee: task.employee,
              motif: task.motif,
              type: task.type,
              phone: task.phone,
              responsables: task.responsables,
            };
          })
            .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      });
  }

  
  useLanguage(language: string): void {
    this.translate.use(language);
    this.authService.saveLanguage(language);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  goToIdeaDetails(notif: TaskDto) {
    if (this.loggedInUser.roles === Profile.CHEF_SEGMENT) {
      this.router.navigateByUrl('ideas/selection/'+notif.ideaId);
    }
    if (this.loggedInUser.roles === Profile.CONTRE_MAITRE) {
      this.router.navigateByUrl('ideas/preselection/'+notif.ideaId);
    }
    if (this.loggedInUser.roles === Profile.EXPERT) {
      this.router.navigateByUrl('ideas/execution/'+notif.ideaId);
    }
  }
  ngOnDestroy(): void {
    this.taskCompletionSubscription.unsubscribe();
  }

}
