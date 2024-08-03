import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TableColumn } from 'src/app/shared/interfaces/table-column';
import { TableButtonAction } from 'src/app/shared/interfaces/table-button-action';
import { ModalService } from 'src/app/shared/services/modal.service';
import { DefaultModalComponent } from 'src/app/shared/components/default-modal/default-modal.component';

@Component({
  selector: 'app-structures-list',
  templateUrl: './structures-list.component.html',
  styleUrls: ['./structures-list.component.scss']
})
export class StructuresListComponent {
  displayedColumns: Array<string> = [];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();


  structuresColumns: Array<TableColumn> = [
    {
      columnDef: 'id',
      header: 'structureContent.sites.columns.site',

    },
    {
      columnDef: 'nombrePlants',
      header: 'structureContent.sites.columns.plantsNumber',

    },
    {
      columnDef: 'nombreSegments',
      header: 'structureContent.sites.columns.segmentsNumber',

    },
    {
      columnDef: 'nombreLignes',
      header: 'structureContent.sites.columns.linesNumber',
    }
  ];


  // structuresColumns: Array<TableColumn> = [
  //   {
  //     columnDef: 'site',
  //     header: 'structureContent.sites.columns.site',

  //   },
  //   {
  //     columnDef: 'nombrePlants',
  //     header: 'structureContent.sites.columns.plantsNumber',

  //   },
  //   {
  //     columnDef: 'nombreSegments',
  //     header: 'structureContent.sites.columns.segmentsNumber',

  //   },
  //   {
  //     columnDef: 'nombreLignes',
  //     header: 'structureContent.sites.columns.linesNumber',
  //   }
  // ];
  structuresData: any[] = 
  [
    {
      "id": 1,
      "site": "Sousse",
      "nombrePlants": 6,
      "nombreSegments": 43,
      "nombreLignes": 108
    },
    {
      "id": 2,
      "site": "Manzel hayet",
      "nombrePlants": 3,
      "nombreSegments": 34,
      "nombreLignes": 124
    },
    {
      "id": 3,
      "site": "Mateur Nord",
      "nombrePlants": 2,
      "nombreSegments": 7,
      "nombreLignes": 34
    },
    {
      "id": 4,
      "site": "Mateur Sud",
      "nombrePlants": 3,
      "nombreSegments": 13,
      "nombreLignes": 63
    }
  ];

  constructor(private router: Router, private modalService: ModalService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.structuresData);
  }

  editClick() {

  }
  deleteClick() {

  }

  onTableAction(e: TableButtonAction): void {
    if (e.name === 'edit') {
      this.router.navigateByUrl('structure/edit/' + e.value['id']);
    }
    if (e.name === 'delete') {
      this.modalService.create({
        name: e.value.site,
        title: this.translate.instant('structureContent.deleteSite.title'),
        message: this.translate.instant('structureContent.deleteSite.message'),
        isDeleteConfirmationModal: false,
        component : DefaultModalComponent,
        width: '35%',
        height: 'fit-content',
        customModalClass: 'alert-modal',
        buttons: [
          {
            type: 'stroked',
            text: this.translate.instant('structureContent.deleteSite.cancel'),
            handler: () => {
              return true;
            }
          },
          {
            type: 'flat',
            text: this.translate.instant('structureContent.deleteSite.confirm'),
            handler: () => {
              return true;
            }
          }
        ]
      });
    }
  }
  addSite() {
    this.router.navigateByUrl('structure/add');
  }
}
