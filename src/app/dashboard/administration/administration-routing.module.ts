import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PermissionsManagmentListComponent } from './permissions-managment-list/permissions-managment-list.component';
import { RoleManagmentListComponent } from './role-managment-list/role-managment-list.component';
import { AppSetupComponent } from './app-setup/app-setup.component';
import { AdministrationComponent } from './administration.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'roles',
    pathMatch: 'full',
    data: {
      breadcrumb: {
        label: 'headerSection.admin',
        info: 'home',
      },
    },
  },
  {
    path: '',
    component: AdministrationComponent,
    children: [
      {
        path: 'permissions',
        component: PermissionsManagmentListComponent,
        data: {
          breadcrumb: {
            label: 'headerSection.permissions',
          },
        },
      },
      {
        path: 'roles',
        component: RoleManagmentListComponent,
        data: {
          breadcrumb: {
            label: 'headerSection.roles',
          },
        },
      },
      {
        path: 'application-config',
        component: AppSetupComponent,
        data: {
          breadcrumb: {
            label: 'headerSection.configurationApplication',
          },
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule {}
