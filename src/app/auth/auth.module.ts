import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';
import { SharedModule } from '../shared/shared.module';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MatriculeSiginComponent } from './matricule-sigin/matricule-sigin.component';
import { VerifyOtpComponent } from './verify-otp/verify-otp.component';


@NgModule({
  declarations: [
    LoginComponent,
    AuthComponent,
    ResetPasswordComponent,
    ChangePasswordComponent,
    MatriculeSiginComponent,
    VerifyOtpComponent  
  ],
  imports: [
    CommonModule,
    AuthRoutingModule,
    SharedModule
  ]
})
export class AuthModule { }
