import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './employees.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';
import { EmployeesListComponent } from './employees-list/employees-list.component';

const routes: Routes = [
  {
    path: '',
    component: EmployeesComponent,
    data: {
      breadcrumb: {
        label: 'headerSection.gestionEmployees',
        info: 'home',
      },
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: EmployeesListComponent,
      },
      {
        path: 'add',
        component: AddEmployeeComponent,
        data: {
          breadcrumb: {
            label: 'employeesManagmentContent.addEmployeeContent.add',
          },
        },
      },
      {
        path: 'edit/:matricule',
        component: EditEmployeeComponent,
        data: {
          breadcrumb: {
            label: 'employeesManagmentContent.edit'
          },
        },
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {}
