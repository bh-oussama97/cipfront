import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { TableColumn } from 'src/app/shared/interfaces/table-column';

@Component({
  selector: 'app-role-managment-list',
  templateUrl: './role-managment-list.component.html',
  styleUrls: ['./role-managment-list.component.scss']
})
export class RoleManagmentListComponent implements OnInit {
  isRolesLoader:boolean=false;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  selectedEmployee:string = '';
  rolesColumns: TableColumn[] = [
    {
      columnDef: 'title',
      header: 'rolesContent.titre',
      placeholder : 'rolesContent.titlePlaceholder',
      type: 'text'
    },
    {
      columnDef: 'description',
      header: 'rolesContent.description',
      placeholder : 'rolesContent.descriptionPlaceholder',
      type: 'text'
    },
    {
      columnDef: 'isAssign',
      type: 'isEdit',
      header: 'rolesContent.assign',
    },
  ];
  rolesData: any[] = [
    {
      id: 1,
      title: 'Opex',
      description: 'Opex'
    },
    {
      id: 2,

      title: 'Contre-Maître',
      description: 'Contre-Maître'
    },
    {
      id: 3,
      title: 'Chef-segment',
      description: 'Chef-segment'
    },
    {
      id: 4,
      title: 'Expert',
      description: 'Expert'
    },
    {
      id: 5,
      title: 'Admin',
      description: 'Admin'
    },
    {
      id: 6,
      title: 'Admin-secondaire',
      description: 'Admin-secondaire'
    },
  ];
  constructor(private translate : TranslateService,private snackbar : MatSnackBar){}
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.rolesData);
  }

  addRole() {
    const newRow: any = {
      title: '',
      description: '',
      isAdd:true
    }
    this.dataSource.data = [newRow, ...this.dataSource.data];
  }

  saveRole(row:any)
  {
    this.snackbar
    .open(this.translate.instant('rolesContent.roleSuccessAdd'), 'X', {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: 'notif-success'
    })
    .afterOpened()
    .subscribe((res) => {
    });
    row.isAdd = false;
  }

  loadDataSelectedEmployee(){
    this.isRolesLoader=true;
    setTimeout(() => {
      this.isRolesLoader = false;
    }, 3000);
  }
  }

