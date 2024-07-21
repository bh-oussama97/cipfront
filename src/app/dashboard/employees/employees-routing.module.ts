import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './employees.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';


const routes: Routes = [
  {
 path : '',
 component : EmployeesComponent,
 pathMatch : 'full',
 data: {
  breadcrumb: {
    label: 'Employees Managment',
  }
},
},
{
  path : 'add',
  component : AddEmployeeComponent,
  data: {
    breadcrumb : {
      label: 'Add new employee'
    }
  }
},
{
  path : 'edit/:matricule',
  component : EditEmployeeComponent,
  data: {
    breadcrumb : {
      label: 'Edit'
    }
  }
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class EmployeesRoutingModule { }
