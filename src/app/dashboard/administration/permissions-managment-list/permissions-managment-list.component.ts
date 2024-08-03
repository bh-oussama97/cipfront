import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { TableColumn } from 'src/app/shared/interfaces/table-column';

@Component({
  selector: 'app-permissions-managment-list',
  templateUrl: './permissions-managment-list.component.html',
  styleUrls: ['./permissions-managment-list.component.scss']
})
export class PermissionsManagmentListComponent implements OnInit{

  isPermissionsLoader :boolean =false;
  permissionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
  permissionColumns : TableColumn[] = [
    {
      columnDef : 'transaction',
      header : 'permissionsContent.transaction',
      placeholder : 'permissionsContent.transactionPlaceholder'
    },
    {
      columnDef : 'description',
      header : 'permissionsContent.description',
      placeholder : 'permissionsContent.descriptionPlaceholder'
    },
    {
      columnDef: 'isAssign',
      type: 'isEdit',
      header: 'permissionsContent.assign',
    },
  ];
  permissionsData : any[]= [
    {
      'transaction' : 'SUPER_ADMIN_PERMISSION',
      'description' : 'SUPER_ADMIN_PERMISSION',
    },
    {
      'transaction' : 'CONSULTATION_TABLEAU_BORD',
      'description' : 'CONSULTATION_TABLEAU_BORD',
    },
    {
      'transaction' : 'GESTION_IDEES',
      'description' : 'GESTION_IDEES',
    },
    {
      'transaction' : 'VALIDATION_IDEES',
      'description' : 'VALIDER IDEE ET DONNER NOTE',
    },
    {
      'transaction' : 'EXPORTATION_IDEES',
      'description' : 'EXPORTATION DES DONNEES OU KAIZEN',
    }
  ];
  constructor(private snackbar : MatSnackBar,private translate : TranslateService){}
  ngOnInit(): void {
    this.permissionsDataSource = new MatTableDataSource(this.permissionsData);
  }
  loadRolesData(){
    this.isPermissionsLoader=true;
    setTimeout(() => {
      this.isPermissionsLoader = false;
    }, 3000);
  }
  addNewPermission(){
    const newRow: any = {
      title: '',
      description: '',
      isAdd:true
    }
    this.permissionsDataSource.data = [newRow, ...this.permissionsDataSource.data];
  }h
  savePermission(row:any)
  {
    this.snackbar
    .open(this.translate.instant('permissionsContent.permissionSuccessAdd'), 'X', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: 'notification-success'
    })
    .afterOpened()
    .subscribe((res) => {
    });
    row.isAdd = false;
  }
}
