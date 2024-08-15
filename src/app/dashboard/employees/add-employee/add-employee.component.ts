import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { faCirclePlus, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { Observable, map } from 'rxjs';
import { IFile } from 'src/app/shared/interfaces/file';
import { FileService } from 'src/app/shared/services/file.service';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent  implements OnInit {
  personalInformationsForm: FormGroup;
  affecterRoleForm: FormGroup;
  affecterEmployeeForm: FormGroup;
  stepperOrientation: Observable<StepperOrientation>;
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
    private fileService :FileService
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
    this.affecterEmployeeForm = this.fb.group({
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
 
  addEmployee(){
    this.snackbar
    .open(this.translate.instant('employeesManagmentContent.addEmployeeContent.successAdd'), 'X', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: 'notification-success'
    })
    .afterDismissed()
    .subscribe((res) => {
      this.router.navigateByUrl('employees');
    });
  }


  getUploadedFiles(files: IFile) {
    this.uploadedLoading = true;
    const data: FormData = new FormData();
    data.append('file', files.value);
    this.fileService.uploadEmployees(data).subscribe(
      {
        next: (response: HttpResponse<any>) => {
          if (response !== null) {
            this.snackbar.open(response['message'], '', {
              duration: 2000,
              horizontalPosition: 'center',
              verticalPosition: 'top',
              panelClass: 'notification-success',
            });
          }
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
