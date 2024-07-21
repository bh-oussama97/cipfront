import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TableButtonAction } from 'src/app/shared/interfaces/table-button-action';
import { TableColumn } from 'src/app/shared/interfaces/table-column';
import { ModalService } from 'src/app/shared/services/modal.service';
import { DefaultModalComponent } from 'src/app/shared/components/default-modal/default-modal.component';
import { FileService } from 'src/app/shared/services/file.service';
import { WorksheetColumn } from 'src/app/shared/interfaces/worksheet-column';
@Component({
  selector: 'app-plants',
  templateUrl: './plants.component.html',
  styleUrls: ['./plants.component.scss']
})
export class PlantsComponent implements OnInit{
  
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  plansColumns: Array<TableColumn> = [
    {
      columnDef: 'plant',
      header: 'plantContent.plant',

    },
    {
      columnDef: 'site',
      header: 'plantContent.site',

    },
    {
      columnDef: 'segmentsNumber',
      header: 'plantContent.segmentsNumber',
    } 
  ];
  structuresData: any[]  = [
    {
      "id" : 1,
      "plant" : "BMW",
      "site" : "Sousse",
      "segmentsNumber": 43,
    },
    {
      "id" : 2,
      "plant" : "VW",
      "site" : "Sousse",
      "segmentsNumber": 34,
    },
    {
      "id" : 3,
      "plant" : "Audi",
      "site" : "Sousse",
      "segmentsNumber": 7,
    },
    {
      "id" : 4,
      "plant" : "MS1",
      "site" : "Mateur Sud",
      "segmentsNumber": 7
    },{
      "id" : 5,
      "plant" : "MN1",
      "site" : "Mateur Nord",
      "segmentsNumber": 4
    },
    {
      "id" : 6,
      "plant" : "MH1",
      "site" : "Manzel Hayet",
      "segmentsNumber": 22
    }
  ];
constructor(private router :Router,private modalService : ModalService,
  private translate: TranslateService,private fileService:FileService)
{
  
}
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.structuresData);
  }
  searchByPlantOrSite(event:any)
  {
    const filterValue = (event.target as HTMLInputElement).value;    
    this.dataSource.filter = filterValue.trim().toLowerCase();

  }
  addPlant(){
    this.router.navigateByUrl('dashboard/plants/add');
  }
  downloadTemplate(){
    let plantsColumns : WorksheetColumn[]=[
      {header:this.translate.instant('plantContent.site'),key : 'plant',width:15 },
      {header:this.translate.instant('plantContent.plant'),key : 'site',width:50}
    ];
    this.fileService.exportTemplateXLSX('plantsSheet',plantsColumns,'plants.xlsx');
  }

  onTableAction(e: TableButtonAction): void {
    if (e.name === 'edit')
    {
      this.router.navigateByUrl('dashboard/plants/edit/'+e.value['id']);
    }
    if (e.name === 'delete')
    {
      this.modalService.create({
        name: e.value.plant,
        title: this.translate.instant('plantContent.deletePlant.title'),
        message: this.translate.instant('plantContent.deletePlant.message'),
        isDeleteConfirmationModal: false,
        component : DefaultModalComponent,
        width: '35%',
        height: 'fit-content',
        customModalClass : 'custom-modalbox',
        buttons: [
          {
            type: 'stroked',
            text: this.translate.instant('plantContent.deletePlant.cancel'),
            handler: () => {
              return true;
            }
          },
          {
            type: 'flat',
            text: this.translate.instant('plantContent.deletePlant.confirm'),
            handler: () => {
              return true;
            }
          }
        ]
      });
    }
  }

}
