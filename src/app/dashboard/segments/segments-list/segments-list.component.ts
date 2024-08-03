import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DefaultModalComponent } from 'src/app/shared/components/default-modal/default-modal.component';
import { TableButtonAction } from 'src/app/shared/interfaces/table-button-action';
import { TableColumn } from 'src/app/shared/interfaces/table-column';
import { WorksheetColumn } from 'src/app/shared/interfaces/worksheet-column';
import { FileService } from 'src/app/shared/services/file.service';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-segments-list',
  templateUrl: './segments-list.component.html',
  styleUrls: ['./segments-list.component.scss']
})
export class SegmentsListComponent implements OnInit{
  segmentsData: any[] = [
    {
      "id": 1,
      "segment": "Cutting & WPA MEB AUTARK",
      "plant": "BMW",
      "site": "Sousse",
      "linesNumber": 43
    },
    {
      "id": 2,
      "segment": "Segment 45",
      "plant": "VW",
      "site": "Sousse",
      "linesNumber": 34
    },
    {
      "id": 3,
      "segment": "Segment Muster SYSAPP",
      "plant": "Audi",
      "site": "Sousse",
      "linesNumber": 7
    },
    {
      "id": 4,
      "segment": "Segment 59",
      "plant": "MS1",
      "site": "Mateur Sud",
      "linesNumber": 7
    },
    {
      "id": 5,
      "segment": "Segment 53-1",
      "plant": "MN1",
      "site": "Mateur Nord",
      "linesNumber": 4
    },
    {
      "id": 6,
      "segment": "Cutting & WPA SYSAPP LTN1",
      "plant": "MH1",
      "site": "Manzel Hayet",
      "linesNumber": 22
    }

  ];
  segmentsColumns: Array<TableColumn> = [
    {
      columnDef: 'segment',
      header: 'segementsContent.segement',

    },
    {
      columnDef: 'plant',
      header: 'segementsContent.plant',

    },
    {
      columnDef: 'site',
      header: 'segementsContent.site',
    },
    {
      columnDef: 'linesNumber',
      header: 'segementsContent.linesNumber',
    }
  ];
  constructor(private router: Router, private modalService: ModalService, private translate: TranslateService,private fileService : FileService) { }
  ngOnInit(): void {
  }
  addSegment() {
    this.router.navigateByUrl('segments/add');
  }
  downloadSegmentsTemplate() {
    let segmentsColumns : WorksheetColumn[]=[
      {header:this.translate.instant('segementsContent.segement'),key : 'segement',width:15 },
      {header:this.translate.instant('segementsContent.plant'),key : 'plant',width:50},
      {header:this.translate.instant('segementsContent.site'),key : 'site',width:50},
    ];
    this.fileService.exportTemplateXLSX('segmentsSheet',segmentsColumns,'segments.xlsx');
  }
  searchSegment(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
  }
  onTableAction(e: TableButtonAction): void {
    if (e.name === 'edit') {
      this.router.navigateByUrl('segments/edit/' + e.value['id']);
    }
    if (e.name === 'delete') {
      this.modalService.create({
        name: e.value.segment,
        title: this.translate.instant('segementsContent.deleteSegment.title'),
        message: this.translate.instant('segementsContent.deleteSegment.message'),
        isDeleteConfirmationModal: false,
        component : DefaultModalComponent,
        width: '35%',
        height: 'fit-content',
        customModalClass: 'alert-modal',
        buttons: [
          {
            type: 'stroked',
            text: this.translate.instant('segementsContent.deleteSegment.cancel'),
            handler: () => {
              return true;
            }
          },
          {
            type: 'flat',
            text: this.translate.instant('segementsContent.deleteSegment.confirm'),
            handler: () => {
              return true;
            }
          }
        ]
      });
    }
  }
}
