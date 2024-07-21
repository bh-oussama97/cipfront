import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrationRoutingModule } from './administration-routing.module';
import { RoleManagmentListComponent } from './role-managment-list/role-managment-list.component';
import { PermissionsManagmentListComponent } from './permissions-managment-list/permissions-managment-list.component';
import { AppSetupComponent } from './app-setup/app-setup.component';
import { AdministrationComponent } from './administration.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    RoleManagmentListComponent,
    PermissionsManagmentListComponent,
    AppSetupComponent,
    AdministrationComponent
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    SharedModule
  ]
})
export class AdministrationModule { }
