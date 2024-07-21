import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TableButtonAction } from 'src/app/shared/interfaces/table-button-action';
import { TableColumn } from 'src/app/shared/interfaces/table-column';
import { ModalService } from 'src/app/shared/services/modal.service';
import { DataService } from 'src/app/shared/services/data.service';
import { DefaultModalComponent } from 'src/app/shared/components/default-modal/default-modal.component';
import { WorksheetColumn } from 'src/app/shared/interfaces/worksheet-column';
import { FileService } from 'src/app/shared/services/file.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})

export class EmployeesComponent implements OnInit {
  employeesDataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  employeesColumns: TableColumn[] =
    [
      {
        columnDef: 'matricule',
        header: 'employeesManagmentContent.matricule'
      },
      {
        columnDef: 'employee',
        header: 'employeesManagmentContent.employee'
      },
      {
        columnDef: 'site',
        header: 'employeesManagmentContent.site'
      },
      {
        columnDef: 'plant',
        header: 'employeesManagmentContent.plant'
      },
      {
        columnDef: 'segment',
        header: 'employeesManagmentContent.segment'
      },
      {
        columnDef: 'line',
        header: 'employeesManagmentContent.line'
      },
      {
        columnDef: 'master',
        header: 'employeesManagmentContent.master'
      }
    ];

  employeesData: any[] = [
    {
      "matricule": "10343585",
      "employee": "Ben Fraj Rami",
      "master" : "Paul petit",
      "site": "Menzel Hayet",
      "plant": "MH1",
      "segment": "Segment 63-2",
      "line": "",
      "phoneNumber": "+216 96478145"
    },
    {
      "matricule": "10312747",
      "employee": "Chihani Ridha",
      "master": "paul petit",
      "site": "Menzel Hayet",
      "plant": "Wpa MH",
      "segment": "Segment Vkf 2",
      "line": "G-202-6-MH",
      "phoneNumber": "+216 96478145"
    },
    {
      "matricule": "10354618",
      "employee": "Tlili Wala",
      "master": "paul petit",
      "site": "Menzel Hayet",
      "plant": "MH2",
      "segment": "Segment 400-2",
      "line": "G-400-2-2",
      "phoneNumber": "+216 96478145"
    },
    {
      "matricule": "10354618",
      "employee": "Tlili Wala",
      "master": "paul petit",
      "site": "Menzel Hayet",
      "plant": "MH2",
      "segment": "Segment 400-2",
      "line": "G-400-2-2",
      "phoneNumber": "+216 96478145"
    },
    {
      "matricule": "10343566",
      "employee": "Mejri Henda",
      "firstName": "Henda",
      "lastName": "Mejri",
      "master": "paul petit",
      "site": "",
      "plant": "",
      "segment": "",
      "line": "",
      "phoneNumber": "+216 96478145"
    }
  ];
  employeesDataFiltered: any[] = [];
  sheetColumns: WorksheetColumn[];

  constructor(private router: Router,
    private modalService: ModalService,
    private translate: TranslateService,
    private dataService: DataService,
    private fileService: FileService
  ) { }

  ngOnInit(): void {
    this.sheetColumns = [
      { header: this.translate.instant('employeesManagmentContent.matricule'), key: 'matricule', width: 20 },
      { header: this.translate.instant('employeesManagmentContent.employee'), key: 'employee', width: 20 },
      { header: this.translate.instant('employeesManagmentContent.site'), key: 'site', width: 20 },
      { header: this.translate.instant('employeesManagmentContent.plant'), key: 'plant', width: 20 },
      { header: this.translate.instant('employeesManagmentContent.segment'), key: 'segment', width: 20 },
      { header: this.translate.instant('employeesManagmentContent.line'), key: 'line', width: 20 },
    ];
    this.employeesDataFiltered = this.employeesData;
  }

  addNewEmployee( ) {
    this.router.navigateByUrl('dashboard/employees/add');
  }

  downloadTemplate() {
    this.fileService.exportTemplateXLSX('employeesSheet', this.sheetColumns, 'employees.xlsx');
  }

  export() {
    this.fileService.exportTableXLSX('employeesSheet', this.sheetColumns, 'employees-export.xlsx', this.employeesDataSource.data);
  }

  searchEmployee(event: any) {
    let filterValue = (event.target as HTMLInputElement).value;
    this.employeesDataSource.filter = filterValue;
    this.employeesDataFiltered = this.employeesData.filter
      (employee => employee.employee.toLowerCase().includes(filterValue.toLowerCase())
        || employee.matricule.toLowerCase().includes(filterValue.toLowerCase())
      );

    this.employeesDataSource.data = this.employeesDataFiltered;
  }

  onTableAction(event: TableButtonAction) {
    if (event.name === "edit") {
      this.dataService.transfertObject(event.value);
      this.router.navigateByUrl('/dashboard/employees/edit/' + event.value.matricule);
    }

    if (event.name === "deactivate") {
      this.modalService.create({
        component: DefaultModalComponent,
        name: event.value.employee,
        title: this.translate.instant('employeesManagmentContent.desactivateEmployeeContent.title'),
        message: this.translate.instant('employeesManagmentContent.desactivateEmployeeContent.message'),
        isDeleteConfirmationModal: false,
        width: '30%',
        height: 'fit-content',
        customModalClass: 'alert-modal',
        buttons: [
          {
            type: 'stroked',
            text: this.translate.instant('employeesManagmentContent.desactivateEmployeeContent.no'),
            handler: () => {
              return true;
            }
          },
          {
            type: 'flat',
            text: this.translate.instant('employeesManagmentContent.desactivateEmployeeContent.yes'),
            handler: () => {
              return true;
            }
          }
        ]
      });
    }

  }

}
