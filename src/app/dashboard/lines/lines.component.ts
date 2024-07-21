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
  selector: 'app-lines',
  templateUrl: './lines.component.html',
  styleUrls: ['./lines.component.scss']
})
export class LinesComponent implements OnInit {

  linesColumns: Array<TableColumn> = [
    {
      columnDef: 'line',
      header: 'linesContent.line',

    },
    {
      columnDef: 'contreMaitre',
      header: 'linesContent.contreMaitre',

    },
    {
      columnDef: 'segment',
      header: 'linesContent.segment',
    },
    {
      columnDef: 'plant',
      header: 'linesContent.plant',
    },
    {
      columnDef: 'site',
      header: 'linesContent.site',
    }
  ];
  linesData : any[] = [
    {
      'id' : 1,
      'line'  : 'Shift',
      'contreMaitre' : 'Contre maitre 1',
      'segment' : 'Cutting & WPA MEB AUTARK',
      'plant' : 'BMW',
      'site' : 'Sousse'
    },
    {
      'id' : 2,
      'line'  : 'Shift 2',
      'contreMaitre' : 'Contre maitre 2',
      'segment' : 'Segment 45',
      'plant' : 'VW',
      'site' : 'Sousse'
    },
    {
      'id' : 3,
      'line'  : 'Shift 3',
      'contreMaitre' : 'Contre maitre 3',
      'segment' : 'Segment Muster SYSAPP',
      'plant' : 'Audi',
      'site' : 'Sousse'
    },
    {
      'id' : 4,
      'line'  : 'Shift 4',
      'contreMaitre' : 'Contre maitre 4',
      'segment' : 'Segment 59',
      'plant' : 'MS1',
      'site' : 'Mateur Sud'
    },
    {
      'id' : 5,
      'line'  : 'Shift 5',
      'contreMaitre' : 'Contre maitre 5',
      'segment' : 'Segment 53-1',
      'plant' : 'MN1',
      'site' : 'Mateur Nord'
    },
    {
      'id' : 6,
      'line'  : 'Shift 6',
      'contreMaitre' : 'Contre maitre 6',
      'segment' : 'Cutting & WPA SYSAPP LTN1',
      'plant' : 'MH1',
      'site' : 'Manzel Hayet'
    }
  ];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();

  constructor(private router : Router,private modalService : ModalService,private translate : TranslateService,private fileService:FileService) { }
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.linesData);
  }
  addNewLine(){
    this.router.navigateByUrl('/dashboard/lines/add');
  }
  searchByPlantOrSite(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;    
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  onTableAction(event:TableButtonAction)
  {
    if (event.name === 'edit')
    {
      this.router.navigateByUrl('dashboard/lines/edit/'+event.value.id);
    }
    if (event.name === 'delete')
    {
      this.modalService.create({
        name: event.value.line,
        title: this.translate.instant('linesContent.deleteLine.title'),
        message: this.translate.instant('linesContent.deleteLine.message'),
        isDeleteConfirmationModal: false,
        component : DefaultModalComponent,
        width: '35%',
        height: 'fit-content',
        customModalClass: 'alert-modal',
        buttons: [
          {
            type: 'stroked',
            text: this.translate.instant('linesContent.deleteLine.cancel'),
            handler: () => {
              return true;
            }
          },
          {
            type: 'flat',
            text: this.translate.instant('linesContent.deleteLine.confirm'),
            handler: () => {
              return true;
            }
          }
        ]
      });
    }
  }



  downloadTemplate(){
    let linesColumns:WorksheetColumn[] = [
      {header:this.translate.instant('linesContent.segment'),key : 'segement',width:15 },
      {header:this.translate.instant('linesContent.plant'),key : 'plant',width:50},
      {header:this.translate.instant('linesContent.site'),key : 'site',width:50},
      {header:this.translate.instant('linesContent.line'),key : 'line',width:50}
    ];
    this.fileService.exportTemplateXLSX('lineSheet',linesColumns,'lines.xlsx');
  }
}
