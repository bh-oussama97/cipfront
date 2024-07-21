import { Component, OnInit } from '@angular/core';
import { RankDto } from 'src/app/shared/interfaces/rank-dto';
import { TableColumn } from 'src/app/shared/interfaces/table-column';
import { IdeaService } from 'src/app/shared/services/idea.service';
import { DateTime } from 'luxon';
import { TableButtonAction } from 'src/app/shared/interfaces/table-button-action';
import { DataService } from 'src/app/shared/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {

  rankingDataSource: any[];

  rankingColumns: TableColumn[] =
    [
      {
        columnDef: 'rank',
        header: 'rankingContent.header.rank'
      },
      {
        columnDef: 'matricule',
        header: 'rankingContent.header.matricule'
      },

      {
        columnDef: 'employee',
        header: 'rankingContent.header.employee'
      },
      {
        columnDef: 'average',
        header: 'rankingContent.header.average'
      },
      {
        columnDef: 'kaizenCard',
        header: 'rankingContent.header.kaizen-card'
      },
      {
        columnDef: 'date',
        header: 'rankingContent.header.date'
      }
    ];

  constructor(private ideaService: IdeaService,private dataService : DataService,private router:Router) { }

  ngOnInit(): void {
    this.ideaService.getRakingIdeas().subscribe((response: RankDto[]) => {
      this.rankingDataSource = response.map(rank => {
        return {
          rank: rank.rank,
          matricule: rank.matricule,
          employee: rank.full_name,
          average: rank.average,
          kaizenCard: rank.kaisenFile,
          date: DateTime.fromISO(rank.ideaDate).toFormat("dd/MM/yyyy hh:mm a")
        }
      });
    })
  }

  rakingActions(event: TableButtonAction) {    
    // if (event.name === 'details') {
    //   this.dataService.transfertObject(event.value);
    //   this.router.navigateByUrl('dashboard/ideas/details/' + event.value.ideeNumber);
    // }

    // if (event.name === 'edit' ) {
    //   this.dataService.transfertObject(event.value);
    //   this.router.navigateByUrl('dashboard/ideas/preselection');
    // }
  }


}
