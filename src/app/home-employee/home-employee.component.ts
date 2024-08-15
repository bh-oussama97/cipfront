  import { Component, OnInit } from '@angular/core';
  import { FormBuilder, FormGroup, Validators } from '@angular/forms';
  import { MatSnackBar } from '@angular/material/snack-bar';
  import { Router } from '@angular/router';
  import { TranslateService } from '@ngx-translate/core';
  import { UserDto } from '../shared/interfaces/user-dto';
  import { AuthService } from '../shared/services/auth.service';
  import { IdeaService } from '../shared/services/idea.service';
  import { IdeaCreationRequestDto } from '../shared/interfaces/idea-creation-request-dto';
  import { HttpErrorResponse } from '@angular/common/http';
  import { ResponseDto } from '../shared/interfaces/response-dto';
  import { jwtDecode } from "jwt-decode";
  import { UserMatriculeSuccessDto } from '../shared/interfaces/user-matricule-success-dto';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

  @Component({
    selector: 'app-home-employee',
    templateUrl: './home-employee.component.html',
    styleUrls: ['./home-employee.component.scss']
  })
  export class HomeEmployeeComponent implements OnInit{
    faLogout = faArrowRightFromBracket;
    IdeaForm:FormGroup;
    responsables:UserDto[];
    welcomeMessage:string;
    isLoading:boolean=false;
    fullName:string;
    userArr:UserMatriculeSuccessDto;
    constructor(private fb:FormBuilder,private translate : TranslateService,
      private snackbar : MatSnackBar,
      private router : Router,
      private authService:AuthService,
      private ideaService:IdeaService
      ) {
        this.translate.use('fr');
    }
    ngOnInit(): void {   

      this.userArr = JSON.parse(localStorage.getItem('userJson'));
      this.responsables = this.userArr.reponsable;
      this.welcomeMessage = "BIENVENUE "  + jwtDecode( this.userArr.accessToken)['full_name'] + " ! -- "+ this.userArr.structure +" --";    
    this.IdeaForm = this.fb.group({
      idea : ['',[Validators.required]],
      superior : ['',[Validators.required]]
    });
    }
    saveIdea(){
      this.isLoading = true;
      if (this.IdeaForm.value.superior === '')
      {
        setTimeout(()=>{
          this.isLoading=false;
          this.snackbar
          .open('الرجاء إدخال مديرك المباشر ', '', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: 'notification-error'
          });  
        },3000);
      
      }
      else if(this.IdeaForm.value.idea === '')
      {
        setTimeout(()=>{
          this.isLoading=false;
          this.snackbar
          .open('الرجاء إدخال الفكرة', '', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: 'notification-error'
          });  
        },3000);
      }
      else{
        let formValue = this.IdeaForm.value;
        const ideaRequest : IdeaCreationRequestDto = {
          matricule : this.userArr.matricule,
          affectedTo : formValue.superior.matricule,
          subject : formValue.idea
        };    
        this.ideaService.createNewIdea(ideaRequest).subscribe({next:(response)=> {
          {
            let successMessage:string = this.translate.instant('loginContent.ideaSavedSuccessMessage') + "\n"+ this.translate.instant('loginContent.ideaSavedSuccessMessageAR');
            if(response['message'] !== '')
            {
            setTimeout(()=>{
              this.isLoading=false;
              this.snackbar
              .open(successMessage, '', {
                duration : 2000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: 'add-idea-success-message'
              })
              .afterDismissed()
              .subscribe((res) => {
                this.authService.logout();
                this.router.navigateByUrl('/matricule-signin');
              });
            },2000);
            }

          }
        },error : (httpError: HttpErrorResponse)=> {
          let responseError: ResponseDto = httpError.error;
          this.snackbar
            .open(responseError.message, '', {
              duration: 2000,
              horizontalPosition: 'right',
              verticalPosition: 'top',
              panelClass: 'notification-error'
            });
        }});      
      }
    }
    logout(){
      this.authService.logout();
      this.router.navigateByUrl('/matricule-signin');
    }
  }
