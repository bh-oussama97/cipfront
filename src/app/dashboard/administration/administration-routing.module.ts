import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsManagmentListComponent } from './permissions-managment-list/permissions-managment-list.component';
import { RoleManagmentListComponent } from './role-managment-list/role-managment-list.component';
import { AppSetupComponent } from './app-setup/app-setup.component';

const routes: Routes = [
  {
    path : 'permissions',
    component : PermissionsManagmentListComponent,
    data: {
      breadcrumb: {
        label: 'Permissions',
      }
    }
  },
  {
    path : 'roles',
    component : RoleManagmentListComponent,
    data: {
      breadcrumb: {
        label: 'Roles',
      }
    }
  },{
    path : 'application-config',
    component : AppSetupComponent,
    data: {
      breadcrumb: {
        label: 'Application configuration',
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }
