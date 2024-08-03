import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ResponseDto } from 'src/app/shared/interfaces/response-dto';
import { UserLoginRequestDto } from 'src/app/shared/interfaces/user-login-request-dto';
import { AuthService } from 'src/app/shared/services/auth.service';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  loginForm : FormGroup;
  roleSelected :string = 'admin';
  displayProgressSpinner:boolean=false;
  constructor(private router:Router,
    private fb:FormBuilder,
    private translate: TranslateService,
    private authService : AuthService,
    private snackbar : MatSnackBar,
    private dataService : DataService
    )
  {
    this.translate.use('fr');
  }

  ngOnInit(): void {
    this.loginForm   = this.fb.group({
      username : new FormControl('',[Validators.required]),
      password : new FormControl('',[Validators.required,Validators.minLength(6)])
    });

  }
  enterSubmit(event:any){
    if (event.keyCode === 13) {
      this.login();
    }
  }
  login(){
    this.displayProgressSpinner = true;
    const userSignBody : UserLoginRequestDto = {
      emailId : this.loginForm.value.username,
      password : this.loginForm.value.password
    }
    
    this.authService.userSignin(userSignBody).subscribe(
      {
        next: (response: any) => {
          if (response !== null) {
              this.displayProgressSpinner = false;
            this.snackbar
            .open(response['message'], '', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: 'notification-success'
            })
            .afterDismissed().subscribe((res) => {
              this.dataService.transfertObject(userSignBody.emailId);
              this.router.navigateByUrl('verify-otp');
            });
          }
        }, error: (httpError: HttpErrorResponse) => {
          this.displayProgressSpinner = false;
          let responseError: ResponseDto = httpError.error;
          this.snackbar
            .open(responseError?.message, '', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: 'notification-error'
            });
        }
  });

  }
  useLanguage(language: string): void {
    this.translate.use(language);
}
}
