import { HttpErrorResponse, HttpHeaderResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatriculeVerificationRequestDto } from 'src/app/shared/interfaces/matricule-verification-request-dto';
import { ResponseDto } from 'src/app/shared/interfaces/response-dto';
import { UserMatriculeSuccessDto } from 'src/app/shared/interfaces/user-matricule-success-dto';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-matricule-sigin',
  templateUrl: './matricule-sigin.component.html',
  styleUrls: ['./matricule-sigin.component.scss']
})
export class MatriculeSiginComponent implements OnInit {
  employeLoginForm: FormGroup;
  errors: string[] = [];
  isLoading:boolean=false;
  constructor(private fb: FormBuilder, private router: Router,
    private translate: TranslateService,
    private authService: AuthService,
    private snackbar: MatSnackBar
  ) {
    this.translate.setDefaultLang('fr');
  }
  ngOnInit(): void {
    this.employeLoginForm = this.fb.group({
      matricule: ['', [Validators.required]]
    })
  }

  employeeLogin() {
    this.isLoading = true;
    if (this.employeLoginForm.invalid) {
      this.errors.push('Matricule Incorrecte');
      this.errors.push('يوجد خطأ في المعرف');
    }
    const employeeLoginDto: MatriculeVerificationRequestDto =
    {
      matricule: this.employeLoginForm.value.matricule
    };

    this.authService.matriculeSignin(employeeLoginDto).subscribe({
      next: (response: UserMatriculeSuccessDto) => {
        if (response !== null) {
          setTimeout(()=>{
            this.isLoading = false;
            this.authService.setToken(response.accessToken);
            this.authService.userArr = response;
            this.authService.save_login_info();
            this.router.navigateByUrl('/home');
          },3000)
        }
      }, error: (httpError: HttpErrorResponse) => {
        setTimeout(() => {
          this.isLoading = false;
          this.snackbar
          .open(httpError.error.message, 'X', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: 'notification-error'
          });
        }, 3000);
   
      }
    });

  }
  enterSubmit(event){
    if (event.keyCode === 13) {
      this.employeeLogin();
    }
  }
}
