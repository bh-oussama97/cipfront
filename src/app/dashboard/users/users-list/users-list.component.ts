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
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit{
  usersDataSource : MatTableDataSource<any> = new MatTableDataSource<any>();
  usersColumns : TableColumn[]=
  [
    {
      columnDef : 'matricule',
      header : 'usersManagmentContent.matricule'
    },
    {
      columnDef : 'user',
      header : 'usersManagmentContent.user'
    },
    {
      columnDef : 'roles',
      header : 'usersManagmentContent.roles'
    },
    {
      columnDef : 'site',
      header : 'usersManagmentContent.site'
    },
    {
      columnDef : 'plant',
      header : 'usersManagmentContent.plant'
    },
    {
      columnDef : 'segment',
      header : 'usersManagmentContent.segment'
    },
    {
      columnDef : 'line',
      header : 'usersManagmentContent.line'
    },
    {
      columnDef : 'login',
      header : 'usersManagmentContent.login'
    }
  ];
  usersData :any[] = [
    {
      "matricule" : "10343585",
      "user" : "Ben Fraj Rami",
      "firstName" : "Rami",
      "lastName"  :"Ben Fraj",
      "roles" : "CHEF_SEGMENT",
      "site" : "Menzel Hayet",
      "plant"  : "MH1",
      "segment" : "Segment 63-2",
      "line" : "",
      "login" : "foulenbenfoulen@societe.com",
      "phoneNumber" : "+216 96478145"
    },
    {
      "matricule" : "10312747",
      "user" : "Chihani Ridha",
      "firstName" : "Ridha",
      "lastName"  :"Chihani",
      "roles" : "CONTRE_MAITRE",
      "site" : "Menzel Hayet",
      "plant"  : "Wpa MH",
      "segment" : "Segment Vkf 2",
      "line" : "G-202-6-MH",
      "login" : "foulenbenfoulen@societe.com",
      "phoneNumber" : "+216 96478145"
    },
    {
      "matricule" : "10354618",
      "user" : "Tlili Wala",
      "firstName" : "Wala",
      "lastName"  :"Tlili",
      "roles" : "CONTRE_MAITRE",
      "site" : "Menzel Hayet",
      "plant"  : "MH2",
      "segment" : "Segment 400-2",
      "line" : "G-400-2-2",
      "login" : "foulenbenfoulen@societe.com",
      "phoneNumber" : "+216 96478145"
    },
    {
      "matricule" : "10354618",
      "user" : "Tlili Wala",
      "firstName" : "Wala",
      "lastName"  :"Tlili",
      "roles" : "CONTRE_MAITRE",
      "site" : "Menzel Hayet",
      "plant"  : "MH2",
      "segment" : "Segment 400-2",
      "line" : "G-400-2-2",
      "login" : "foulenbenfoulen@societe.com",
      "phoneNumber" : "+216 96478145"
    },
    {
      "matricule" : "10343566",
      "user" : "Mejri Henda",
      "firstName" : "Henda",
      "lastName"  :"Mejri",
      "roles" : "ADMIN_SECOND",
      "site" : "",
      "plant"  : "",
      "segment" : "",
      "line" : "",
      "login" : "foulenbenfoulen@societe.com",
      "phoneNumber" : "+216 96478145"
    }
  ];
  usersDataFiltered : any[] = [];
  sheetColumns : WorksheetColumn[];
  constructor(private router:Router,
    private modalService : ModalService,
    private translate : TranslateService,
    private dataService : DataService,
    private fileService : FileService
    ){}
  ngOnInit(): void {
    this.sheetColumns = [
      {header:this.translate.instant('usersManagmentContent.matricule'),key : 'matricule',width:20},
      {header:this.translate.instant('usersManagmentContent.user'),key : 'user',width:20},
      {header:this.translate.instant('usersManagmentContent.roles'),key : 'roles',width:20 },
      {header:this.translate.instant('usersManagmentContent.site'),key : 'site',width:20},
      {header:this.translate.instant('usersManagmentContent.plant'),key : 'plant',width:20},
      {header:this.translate.instant('usersManagmentContent.segment'),key : 'segment',width:20},
      {header:this.translate.instant('usersManagmentContent.line'),key : 'line',width:20},
      {header:this.translate.instant('usersManagmentContent.login'),key : 'login',width:35},
    ];
    this.usersDataSource = new MatTableDataSource(this.usersData);
   this.usersDataFiltered =this.usersData;
  }
  addNewUser(
   
  ){
    this.router.navigateByUrl('users/add');
  }
  downloadTemplate(){
    this.fileService.exportTemplateXLSX('usersSheet',this.sheetColumns,'users.xlsx');
  }
  export(){
    this.fileService.exportTableXLSX('usersSheet',this.sheetColumns,'users-export.xlsx',this.usersDataSource.data);
  }
  searchUser(event: any)
  {
    let filterValue = (event.target as HTMLInputElement).value;    
    this.usersDataSource.filter = filterValue;
    this.usersDataFiltered = this.usersData.filter
    (user => user.user.toLowerCase().includes(filterValue.toLowerCase())
    || user.matricule.toLowerCase().includes(filterValue.toLowerCase())
    );

    this.usersDataSource.data = this.usersDataFiltered;
  }
  onTableAction(event:TableButtonAction)
  {
    if(event.name === "edit")
    {
      // this.dataService.transfertObject(event.value);
      this.router.navigateByUrl('users/edit/'+event.value.matricule);
    }

    if (event.name === "deactivate")
    {
      this.modalService.create({
        component : DefaultModalComponent,
        name: event.value.user,
        title: this.translate.instant('usersManagmentContent.desactivateUserContent.title'),
        message: this.translate.instant('usersManagmentContent.desactivateUserContent.message'),
        isDeleteConfirmationModal:false,
        width: '30%',
        height: 'fit-content',
        customModalClass: 'alert-modal',
        buttons: [
          {
            type: 'stroked',
            text: this.translate.instant('usersManagmentContent.desactivateUserContent.no'),
            handler: () => {
              return true;
            }
          },
          {
            type: 'flat',
            text: this.translate.instant('usersManagmentContent.desactivateUserContent.yes'),
            handler: () => {
              return true;
            }
          }
        ]
      });
    }
    
  }
}
