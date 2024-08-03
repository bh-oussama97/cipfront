import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { AccountComponent } from './account.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { AuthGuard } from '../shared/guards/auth.guard';

const routes: Routes = [
  {
      path: "",
      redirectTo: "profile",
      pathMatch: "full",
      data: {
        breadcrumb: {
          label: 'headerSection.account',
          info: 'home',
        }
      }
  },
  {
    path: '',
    component : AccountComponent,
    children:[
      {
        path : 'profile',
        pathMatch : 'full',
        component : ProfileComponent,
        data: {
          breadcrumb: {
            label: 'headerSection.profile',
          }
        },
        canActivate: [AuthGuard],
      },
      {
        path : 'settings',
        component : SettingsComponent,
        data: {
          breadcrumb: {
            label: 'headerSection.settings',
          }
        }
      },
      {
        path : 'notifications',
        component : NotificationsComponent,
        data: {
          breadcrumb: {
            label: 'headerSection.notifications',
          }
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule { }
