import { Component, OnInit } from '@angular/core';
import { GetTasksListResponse } from 'src/app/shared/interfaces/get-tasks-list-response';
import { TaskDto } from 'src/app/shared/interfaces/task-dto';
import { UserDto } from 'src/app/shared/interfaces/user-dto';
import { IdeaService } from 'src/app/shared/services/idea.service';
import {DateTime} from 'luxon';
import { Profile } from 'src/app/shared/enum/profile';
import { Info } from 'luxon';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit{
  tasks:TaskDto[];
  filteredTasks:TaskDto[];
  currentUser:UserDto;
  monthNames:string[] = [];
  selectedMonth:string = 'All';
  constructor(private ideaService:IdeaService)
  {}
  ngOnInit(): void {
    // this.selectedMMonth = DateTime.now().toFormat('MMMM');
    this.monthNames = this.getAllMonthNames('long');
    this.monthNames.unshift('All');      

    const userJson:UserDto = JSON.parse(localStorage.getItem('userJson')) as UserDto;
    this.ideaService.getListOfIdeasAffectedByRegistrationNumber( userJson.matricule).subscribe((response:GetTasksListResponse)=>{
      this.tasks = response.tasks.map(task=>  {
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
          responsables : task.responsables,
          contreMaitre : task.responsables.filter(responsable => responsable.roles[0] === Profile.CONTRE_MAITRE)[0]?.fullName,
          chefSegment : task.responsables.filter(responsable => responsable.roles[0] === Profile.CHEF_SEGMENT)[0]?.fullName,
          expert : task.responsables.filter(responsable => responsable.roles[0] === Profile.EXPERT)[0]?.fullName
        }
      }).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      this.filteredTasks = this.tasks;
    });
  }

  getAllMonthNames(format: 'long' | 'short' | 'narrow' = 'long'): string[] {
    return Info.months(format);
  }

  filterByMonth(){    
    if (this.selectedMonth === 'All') {
      this.filteredTasks = [...this.tasks];
    } else {
      this.filteredTasks = this.tasks.filter(item => DateTime.fromFormat(item.createdAt,"dd/MM/yyyy hh:mm a").toFormat('MMMM') === this.selectedMonth);
    }
  }

}
