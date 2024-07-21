import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { NotificationsComponent } from './notifications/notifications.component';


@NgModule({
  declarations: [
    ProfileComponent,
    SettingsComponent,
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    AccountRoutingModule,
    SharedModule,

  ]
})
export class AccountModule { }
