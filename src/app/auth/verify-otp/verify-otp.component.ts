import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { catchError, concatMap, of, Subscription, tap } from 'rxjs';
import { Context } from 'src/app/shared/enum/context';
import { OtpVerificationRequestDto } from 'src/app/shared/interfaces/otp-verification-request-dto';
import { UserDto } from 'src/app/shared/interfaces/user-dto';
import { UserLoginSuccessDto } from 'src/app/shared/interfaces/user-login-success-dto';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-verify-otp',
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss']
})
export class VerifyOtpComponent implements OnInit,OnDestroy{
  email: string = '';
  verifyOTPCodeForm: FormGroup;
  isLoading:boolean=false;
  emailMasked:string;
  subscription:Subscription;
  constructor(private fb: FormBuilder, private activatedRoute: ActivatedRoute,
    private authService: AuthService, private snackbar: MatSnackBar,
    private router: Router,private dataservice:DataService
  ) {
  }
  ngOnInit(): void {
    this.verifyOTPCodeForm = this.fb.group({
      verificationCode: ['', Validators.required]
    });
    this.subscription = this.dataservice.currentMessage$.subscribe({
      next: (emailMessage:string) => {
        this.email = emailMessage;        

        if (emailMessage === null) {
          this.email = this.dataservice.getObjectFromSessionStorage();
        }
      }
    });    
    this.emailMasked = this.maskEmail(this.email);
  }
  enterSubmit(event:any){
    if (event.keyCode === 13) {
      this.verifyCode();
    }
  }
  verifyCode() {
    this.isLoading=true;
    const otpRequest: OtpVerificationRequestDto =
    {
      emailId: this.email,
      context: Context.LOGIN,
      oneTimePassword: parseInt(this.verifyOTPCodeForm.value.verificationCode)
    };
    this.authService.verifyOtp(otpRequest)
      .pipe(
        catchError(error => {
          setTimeout(()=>{
            this.isLoading = false;
            this.snackbar
              .open("Please check the otp !", 'X', {
                duration: 2000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: 'notification-error'
              });
          },2000);
          return of(null); 
        }),
        tap((firstResponse: UserLoginSuccessDto) => {
          this.authService.setToken(firstResponse.accessToken);
        }),
        concatMap(() => this.authService.getLoggedInUser())
      )
      .subscribe((secondResponse: any) => {
        setTimeout(()=>{
          this.isLoading = false;
          let userArr: UserDto = {
            email: secondResponse['email_id'],
            roles: secondResponse['role'][0],
            matricule: secondResponse.matricule
          }
          this.authService.userArr = userArr;
          this.authService.save_login_info();
          this.router.navigateByUrl('/dashboard');
        },2000);
      });

  }

  maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    const maskedLocalPart = localPart.length > 2 
      ? localPart.substring(0, 2) + '*'.repeat(localPart.length - 2) 
      : localPart.replace(/./g, '*');
    
    return `${maskedLocalPart}@${domain}`;
  }
  ngOnDestroy(): void {
    this.dataservice.clearObject();
   }
}
