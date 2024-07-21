import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { HomeEmployeeComponent } from '../home-employee/home-employee.component';
import { MatriculeSiginComponent } from './matricule-sigin/matricule-sigin.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';
import { matriculeAuthGuard } from '../shared/guards/matricule-auth.guard';

const routes: Routes = [
    {
      path: '',
      redirectTo: 'login',
      pathMatch: 'full'
    },
    {
      path: 'login',
      component : LoginComponent
    },
    {
      path : 'reset-password',
      component : ResetPasswordComponent
    },
    {
      path : 'change-password',
      component : ChangePasswordComponent
    },
    {
      path : 'matricule-signin',
      component : MatriculeSiginComponent
    },
    {
      path :'home',
      component : HomeEmployeeComponent,
      canActivate: [matriculeAuthGuard],
    },
    {
      path :'verify-otp',
      component : VerifyOtpComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
