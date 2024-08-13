import { Component, OnInit } from '@angular/core';
import { RankDto } from 'src/app/shared/interfaces/rank-dto';
import { TableColumn } from 'src/app/shared/interfaces/table-column';
import { IdeaService } from 'src/app/shared/services/idea.service';
import { DateTime } from 'luxon';
import { TableButtonAction } from 'src/app/shared/interfaces/table-button-action';
import { DataService } from 'src/app/shared/services/data.service';
import { Router } from '@angular/router';
import { UserDto } from 'src/app/shared/interfaces/user-dto';
import { ConfirmBestIdeaDialogComponent } from 'src/app/shared/components/confirm-best-idea-dialog/confirm-best-idea-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/shared/services/auth.service';
import { WorksheetColumn } from 'src/app/shared/interfaces/worksheet-column';
import { FileService } from 'src/app/shared/services/file.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
})
export class RankingComponent implements OnInit {
  rankingDataSource: any[] = [];

  rankingColumns: TableColumn[] = [
    {
      columnDef: 'rank',
      header: 'rankingContent.header.rank',
      isMedalIcon : true
    },
    {
      columnDef: 'matricule',
      header: 'rankingContent.header.matricule',
    },

    {
      columnDef: 'employee',
      header: 'rankingContent.header.employee',
    },
    {
      columnDef: 'average',
      header: 'rankingContent.header.average',
    },
    {
      columnDef: 'date',
      header: 'rankingContent.header.date',
    },
  ];
  connectedUser: UserDto;
  currentRole: string;
  constructor(
    private ideaService: IdeaService,
    private dataService: DataService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private fileService : FileService,
    private translate :TranslateService

  ) {}

  ngOnInit(): void {
    this.connectedUser = this.authService.get_login_info();
    this.currentRole = this.connectedUser.roles;
    this.getRakingIdeasList(this.connectedUser.matricule);
  }

  rakingActions(event: TableButtonAction) {
    if (event.name === 'details') {
      this.dataService.transfertObject(event.value);
      this.router.navigateByUrl('ideas/details/' + event.value.ideaId);
    }

    if (event.name === 'confirm') {
      this.confirmClick(event);
    }
  }

  confirmClick(eventValue: TableButtonAction) {
    let rankingId = eventValue.value.rankingId;

    this.dialog
      .open(ConfirmBestIdeaDialogComponent, {
        data: {
          id: rankingId,
        },
        minWidth: '30%',
        minHeight: 'fit-content',
        panelClass: 'alert-modal',
      })
      .afterClosed()
      .subscribe((response) => {
        this.getRakingIdeasList(this.connectedUser.matricule);
      });
  }

  getRakingIdeasList(matricule: string) {
    this.ideaService
      .getRakingIdeas(matricule)
      .subscribe((response: RankDto[]) => {
        this.rankingDataSource = response.map((rank) => {
          return {
            ideaId: rank.idea,
            rankingId: rank.id,
            rank: rank.rank,
            matricule: rank.matricule,
            employee: rank.full_name,
            average: rank.average,
            date: DateTime.fromISO(rank.ideaDate,{zone:'utc'}).setZone('Africa/Tunis').toFormat(
              'dd/MM/yyyy hh:mm a'
            ),
          };
        });
      });
  }

  exportRankingList(){
    let rakingColumns:WorksheetColumn[]=[
      {header:this.translate.instant('rankingContent.header.rank'),key : 'rank',width:10 },
      {header:this.translate.instant('rankingContent.header.matricule'),key : 'matricule',width:20},
      {header : this.translate.instant('rankingContent.header.employee'),key: 'employee',width:20},
      {header:this.translate.instant('rankingContent.header.average'),key : 'average',width:20},
      {header:this.translate.instant('rankingContent.header.date'),key : 'date',width:20},
    ];
    this.fileService.exportTableXLSX('ranking',rakingColumns,'ranking.xlsx',this.rankingDataSource);
  }
}
