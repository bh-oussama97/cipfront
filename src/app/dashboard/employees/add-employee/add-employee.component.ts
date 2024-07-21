import { BreakpointObserver } from '@angular/cdk/layout';
import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { faCirclePlus, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { Observable, map } from 'rxjs';
import { IFile } from 'src/app/shared/interfaces/file';

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
  constructor(private fb: FormBuilder, 
    breakpointObserver: BreakpointObserver,
    private snackbar : MatSnackBar,
    private translate : TranslateService,
    private router : Router
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
      panelClass: 'notif-success'
    })
    .afterDismissed()
    .subscribe((res) => {
      this.router.navigateByUrl('/dashboard/employees');
    });
  }


  getUploadedFiles(fileList: IFile[]) {
    if(fileList.length > 0)
    {
      this.snackbar
      .open(this.translate.instant('employeesManagmentContent.addEmployeeContent.successAdd'), 'X', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: 'notif-success'
      })
      .afterDismissed()
      .subscribe((res) => {
        this.router.navigateByUrl('/dashboard/employees');
      });
    }
  }

}
