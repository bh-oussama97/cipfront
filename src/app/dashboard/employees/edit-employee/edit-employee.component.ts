import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit{
  editEmployeeForm:FormGroup;
  employeeToEdit: any;
  subscription: Subscription = new Subscription;
  constructor(private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private translate: TranslateService,
    private router: Router,
    private dataservice: DataService
  ) { }  
  ngOnInit() {
    this.subscription = this.dataservice.currentMessage$.subscribe({
      next: (message: any) => {
        this.employeeToEdit = message;
      }
    });

    this.editEmployeeForm = this.fb.group({
      lastName: [this.employeeToEdit.employee.split(" ")[0]],
      firstName: [this.employeeToEdit.employee.split(" ")[1]],
      phone: [this.employeeToEdit.phoneNumber],
      registrationNumber: [this.employeeToEdit.matricule],
      site: [this.employeeToEdit.site],
      plant: [this.employeeToEdit.plant],
      segment: [this.employeeToEdit.segment],
      line: [this.employeeToEdit.line]
    });  }

    edit(){
      this.snackbar
      .open(this.translate.instant('employeesManagmentContent.successEdit'), 'X', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: 'notif-success'
      })
      .afterOpened()
      .subscribe((res) => {
        this.router.navigateByUrl('/dashboard/employees');
      });
    }
}
