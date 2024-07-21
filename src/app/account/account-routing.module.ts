import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountComponent } from './account.component';
import { NotificationsComponent } from './notifications/notifications.component';

const routes: Routes = [
  {
    path:'',
    component : AccountComponent,
  },
  {
    path : 'profile',
    component : ProfileComponent,
    data: {
      breadcrumb: {
        label: 'Profile',
        info: 'home',
      }
    }
  },
  {
    path : 'settings',
    component : SettingsComponent,
    data: {
      breadcrumb: {
        label: 'Settings',
        info: 'home',
      }
    }
  },
  {
    path : 'notifications',
    component : NotificationsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
