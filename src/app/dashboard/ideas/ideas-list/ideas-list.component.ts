import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TableButtonAction } from 'src/app/shared/interfaces/table-button-action';
import { TableColumn } from 'src/app/shared/interfaces/table-column';
import { DataService } from 'src/app/shared/services/data.service';
import { FileService } from 'src/app/shared/services/file.service';
import { WorksheetColumn } from 'src/app/shared/interfaces/worksheet-column';
import { IdeaService } from 'src/app/shared/services/idea.service';
import { TaskDto } from 'src/app/shared/interfaces/task-dto';
import { UserDto } from 'src/app/shared/interfaces/user-dto';
import { DateTime } from 'luxon';
import { Profile } from 'src/app/shared/enum/profile';
import { UserTasksDto } from 'src/app/shared/interfaces/user-tasks-dto';
import { IdeaState } from 'src/app/shared/enum/idea-state';
@Component({
  selector: 'app-ideas-list',
  templateUrl: './ideas-list.component.html',
  styleUrls: ['./ideas-list.component.scss'],
})
export class IdeasListComponent {
  states: string[] = [];
  adminDataSource: MatTableDataSource<any> = new MatTableDataSource();
  contreMaitreIdeasDataSource: MatTableDataSource<any> =
    new MatTableDataSource();
  chefSegmentDataSource: MatTableDataSource<any> = new MatTableDataSource();
  expertDataSource: MatTableDataSource<any> = new MatTableDataSource();
  ideasData: TaskDto[] = [];
  filteredDataSource: TaskDto[] = [];
  ideasAssociatedColumns: Array<TableColumn> = [
    {
      columnDef: 'ideaNumber',
      header: 'ideasContent.ideasListTable.ideaNumber',
    },
    {
      columnDef: 'description',
      header: 'ideasContent.ideasListTable.description',
    },
    {
      columnDef: 'status',
      header: 'ideasContent.ideasListTable.state',
      isState: true,
    },
    {
      columnDef: 'createdAt',
      header: 'ideasContent.ideasListTable.date',
      isDate: true,
    },
    {
      columnDef: 'fullName',
      header: 'ideasContent.ideasListTable.initiatorName',
    },
    {
      columnDef: 'contreMaitre',
      header: 'ideasContent.ideasListTable.contreMaitre',
    },
    {
      columnDef: 'expert',
      header: 'ideasContent.ideasListTable.expert',
    },
    {
      columnDef: 'chefSegment',
      header: 'ideasContent.ideasListTable.chefSegment',
    },
  ];
  transalatedStates: string[] = [];
  currentRole: string;
  matricule: number;
  expertNames: string[] = [];
  chefSegmentNames: string[] = [];
  employeeNames: string[] = [];
  contreMaitreNames: string[] = [];
  selectedExpert: string = 'All';
  selectedEmployee: string = 'All';
  selectedState: string = 'All';
  selectedChefSegment: string = 'All';
  selectedContreMaitre: string = 'All';
  constructor(
    private router: Router,
    private translate: TranslateService,
    private dataService: DataService,
    private fileService: FileService,
    private ideaService: IdeaService
  ) {}
  ngOnInit(): void {
    this.currentRole = JSON.parse(localStorage.getItem('userJson'))['roles'];
    this.states.push(
      'All',
      IdeaState.EXECUTED,
      IdeaState.PRESELECTED,
      IdeaState.SELECTED,
      IdeaState.VALIDATED,
      IdeaState.WAITING,
      IdeaState.REFUSED
    );
    const userJson: UserDto = JSON.parse(
      localStorage.getItem('userJson')
    ) as UserDto;
    this.ideaService
      .getIdeasListByResponsible(userJson.matricule)
      .subscribe((response: UserTasksDto) => {
        this.ideasData = response.tasks.map((task) => {
          return {
            createdAt: DateTime.fromISO(task.createdAt, { zone: 'utc' })
              .setZone('Africa/Tunis')
              .toFormat('dd/MM/yyyy hh:mm a'),
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
            contreMaitre: task.responsables.filter(
              (responsable) => responsable.roles[0] === Profile.CONTRE_MAITRE
            )[0]?.fullName,
            chefSegment: task.responsables.filter(
              (responsable) => responsable.roles[0] === Profile.CHEF_SEGMENT
            )[0]?.fullName,
            expert: task.responsables.filter(
              (responsable) => responsable.roles[0] === Profile.EXPERT
            )[0]?.fullName,
          };
        });
        this.filteredDataSource = [...this.ideasData];
        // if (this.currentRole === Profile.CONTRE_MAITRE) {
        //   this.filteredDataSource = this.ideasData.filter(
        //     (el) => el.status === IdeaState.WAITING
        //   );
        // }
        // if (this.currentRole === Profile.CHEF_SEGMENT) {
        //   this.filteredDataSource = this.ideasData.filter(
        //     (el) => el.status === IdeaState.PRESELECTED
        //   );
        // }
        // if (this.currentRole === Profile.EXPERT) {
        //   this.filteredDataSource = this.ideasData.filter(
        //     (el) => el.status === IdeaState.SELECTED
        //   );
        // }

        this.chefSegmentNames = Array.from(
          new Set(
            this.ideasData
              .map((idea) => {
                return idea.chefSegment;
              })
              .filter((ele) => ele !== undefined)
          )
        );
        this.chefSegmentNames.unshift('All');
        this.expertNames = Array.from(
          new Set(
            this.ideasData
              .map((idea) => {
                return idea.expert;
              })
              .filter((ele) => ele !== undefined)
          )
        );
        this.expertNames.unshift('All');
        this.employeeNames = Array.from(
          new Set(
            this.ideasData
              .map((idea) => {
                return idea.fullName;
              })
              .filter((ele) => ele !== undefined)
          )
        );
        this.employeeNames.unshift('All');
        this.contreMaitreNames = Array.from(
          new Set(
            this.ideasData
              .map((idea) => {
                return idea.contreMaitre;
              })
              .filter((ele) => ele !== undefined)
          )
        );
        this.contreMaitreNames.unshift('All');
      });
    this.transalatedStates = this.states.map((state) =>
      state.replace(state, 'ideasContent.' + state)
    );
  }
  filterbyExpert() {
    if (this.selectedExpert === 'All') {
      this.filteredDataSource = [...this.ideasData];
    } else {
      this.filteredDataSource = this.ideasData.filter(
        (item) => item.expert === this.selectedExpert
      );
    }
  }
  filterByState() {
    if (this.selectedState === 'All') {
      this.filteredDataSource = [...this.ideasData];
    } else {
      this.filteredDataSource = this.ideasData.filter(
        (item) => item.status === this.selectedState
      );
    }
  }
  filterbyEmployee() {
    if (this.selectedEmployee === 'All') {
      this.filteredDataSource = [...this.ideasData];
    } else {
      this.filteredDataSource = this.ideasData.filter(
        (item) => item.fullName === this.selectedEmployee
      );
    }
  }
  filterByChefSegment() {
    if (this.selectedChefSegment === 'All') {
      this.filteredDataSource = [...this.ideasData];
    } else {
      this.filteredDataSource = this.ideasData.filter(
        (item) => item.chefSegment === this.selectedChefSegment
      );
    }
  }
  filterByContreMaitre() {
    if (this.selectedContreMaitre === 'All') {
      this.filteredDataSource = [...this.ideasData];
    } else {
      this.filteredDataSource = this.ideasData.filter(
        (item) => item.contreMaitre === this.selectedContreMaitre
      );
    }
  }

  exportIdeas() {
    let ideasColumns: WorksheetColumn[] = [
      {
        header: this.translate.instant(
          'ideasContent.ideasListTable.ideaNumber'
        ),
        key: 'ideaNumber',
        width: 10,
      },
      {
        header: this.translate.instant(
          'ideasContent.ideasListTable.initiatorName'
        ),
        key: 'fullName',
        width: 20,
      },
      {
        header: this.translate.instant(
          'ideasContent.ideasListTable.description'
        ),
        key: 'description',
        width: 40,
      },
      {
        header: this.translate.instant('ideasContent.ideasListTable.state'),
        key: 'status',
        width: 20,
      },
      {
        header: this.translate.instant('ideasContent.ideasListTable.date'),
        key: 'createdAt',
        width: 20,
      },
      {
        header: this.translate.instant(
          'ideasContent.ideasListTable.contreMaitre'
        ),
        key: 'contreMaitre',
        width: 20,
      },
      {
        header: this.translate.instant(
          'ideasContent.ideasListTable.chefSegment'
        ),
        key: 'chefSegment',
        width: 20,
      },
      {
        header: this.translate.instant('ideasContent.ideasListTable.expert'),
        key: 'expert',
        width: 20,
      },
    ];
    this.fileService.exportTableXLSX(
      'ideasSheet',
      ideasColumns,
      'idees.xlsx',
      this.ideasData
    );
  }
  exportAssociatedIdeas() {}
  searchIdeaByName(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredDataSource = this.ideasData.filter((item) =>
      item.description.includes(filterValue)
    );
  }

  associatedTableAction(e: TableButtonAction): void {
    if (e.name === 'edit' && this.currentRole === 'CONTRE_MAITRE') {
      this.dataService.transfertObject(e.value);
      this.router.navigateByUrl('ideas/preselection');
    }
    if (e.name === 'edit' && this.currentRole === 'CHEF_SEGMENT') {
      this.dataService.transfertObject(e.value);
      this.router.navigateByUrl('ideas/selection');
    }
    if (e.name === 'edit' && this.currentRole === 'EXPERT') {
      this.dataService.transfertObject(e.value);
      this.router.navigateByUrl('ideas/execution');
    }
    if (e.name === 'details') {
      //  this.dataService.transfertObject(e.value);
      this.router.navigateByUrl('ideas/details/' + e.value.ideaId);
    }
  }
}
