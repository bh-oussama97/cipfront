import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  verifyCodeForm: FormGroup;
  isVerificationCodeSent = false;
  email_reset: string = '';
  verificationCode: number;
  errors: string[] = [];
  staticVerifCode: number = 159874;
  constructor(private fb: FormBuilder,private router : Router) { }
  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
    this.verifyCodeForm = this.fb.group({
      verificationCode: ['', Validators.required, Validators.minLength(6)]
    });
  }
  resetPassword() {
    if (this.resetPasswordForm.valid) {
      this.isVerificationCodeSent = true;
    }
  }

  verifyCode() {
    if (this.verificationCode !== this.staticVerifCode) {
      this.errors.push('Code incorrecte !');
    }
    this.router.navigateByUrl('/change-password');
  }
}
