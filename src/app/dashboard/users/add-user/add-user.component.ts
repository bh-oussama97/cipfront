import { BreakpointObserver } from '@angular/cdk/layout';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StepperOrientation } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { faCirclePlus, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { Observable, map } from 'rxjs';
import { IFile } from 'src/app/shared/interfaces/file';
import { FileService } from 'src/app/shared/services/file.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  personalInformationsForm: FormGroup;
  affecterRoleForm: FormGroup;
  affecterUserForm: FormGroup;
  stepperOrientation: Observable<StepperOrientation>;
  roles : string[] = ['usersManagmentContent.rolesOptions.opex',
  'usersManagmentContent.rolesOptions.contreMaitre',
  'usersManagmentContent.rolesOptions.chefSegment',
  'usersManagmentContent.rolesOptions.expert',
  'usersManagmentContent.rolesOptions.admin',
  'usersManagmentContent.rolesOptions.adminSecondaire'
];
categories :string[] = [];
selectedRole:string;
isRoleExpert:boolean=true;
emailValue:string;
faCirclePlus = faCirclePlus;
faMinusCircle = faMinusCircle;
uploadedLoading:boolean=false;
  constructor(private fb: FormBuilder, 
    breakpointObserver: BreakpointObserver,
    private snackbar : MatSnackBar,
    private translate : TranslateService,
    private router : Router,
    private fileService:FileService
    ) {
    this.stepperOrientation = breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({ matches }) => (matches ? 'horizontal' : 'vertical')));
  }

  ngOnInit(): void {
    this.personalInformationsForm = this.fb.group({
      lastName: [''],
      firstName: [''],
    phone: [''],
      registrationNumber: [''],
      email: [''],
      login:  new FormControl({ value: '', disabled: true })
    });
    this.affecterRoleForm = this.fb.group({
      role: [],
      itemsRows : this.fb.array([this.initCategoryRow()])
    });
    this.affecterUserForm = this.fb.group({
      siteName : null,
      plantName : null,
      segmentName : null,
      lineName : null
    });
  }
  get formArr() {
    return this.affecterRoleForm.get('itemsRows') as FormArray;
  }
  initCategoryRow(){
    return this.fb.group({
      category : ['']
    })
  }


  addNewRow(){
    this.formArr.push(this.initCategoryRow());
  }
  deleteRow(index:number){
    this.formArr.removeAt(index);
  }
  onValueSelected(valueSelected:MatSelectChange)
  {
    this.selectedRole = valueSelected.value;
    if(this.selectedRole.toLowerCase() === 'expert')
    {
      this.isRoleExpert = false;
    }
  }
  nextRoleForm(){
    
  }
  nextAssignUserForm(){
    
  }

  addUser(){
    this.snackbar
    .open(this.translate.instant('usersManagmentContent.addUserContent.successAdd'), '', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: 'notification-success'
    })
    .afterDismissed()
    .subscribe((res) => {
      this.router.navigateByUrl('users');
    });
  }
  getUploadedFiles(files: IFile) {
    this.uploadedLoading = true;
    const data: FormData = new FormData();
    data.append('file', files.value);
    this.fileService.uploadUsers(data).subscribe(
      {
        next: (response: HttpResponse<any>) => {          
          // if (response !== null) {
          //   this.snackbar.open(response['message'], '', {
          //     duration: 2000,
          //     horizontalPosition: 'center',
          //     verticalPosition: 'top',
          //     panelClass: 'notification-success',
          //   });
          // }
        }, error: (httpError: HttpErrorResponse) => {
          setTimeout(() => {
            this.uploadedLoading = false;            
            if(httpError.status == 417)
            {
              this.snackbar.open(httpError.error, '', {
                duration: 4000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: 'error-notification-message',
              });
            }
            else if(httpError.status == 200 )
            {
              this.snackbar.open(httpError.error.text, '', {
                duration: 4000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: 'error-notification-message',
              });
            }
            else{
              let errorMsj = "";
              Object.keys(httpError.error).forEach(row => {
                let message = httpError.error[row][0];
                errorMsj += message + "\n";
              });
              this.snackbar.open(errorMsj, '', {
                duration: 4000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: 'error-notification-message',
              });
            }

  
          }, 3000);
        }
      });

  }
}
