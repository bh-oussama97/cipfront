import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements OnInit {
  editUserForm: FormGroup;
  subscription: Subscription = new Subscription;
  userToEdit: any;
  emailValue: string;
  constructor(private fb: FormBuilder,
    private snackbar: MatSnackBar,
    private translate: TranslateService,
    private router: Router,
    private dataservice: DataService
  ) { }
  ngOnInit(): void {
    this.subscription = this.dataservice.currentMessage$.subscribe({
      next: (message: any) => {
        this.userToEdit = message;
      }
    });
    this.emailValue = this.userToEdit.login;
    this.editUserForm = this.fb.group({
      lastName: [this.userToEdit.firstName],
      firstName: [this.userToEdit.lastName],
      phone: [this.userToEdit.phoneNumber],
      registrationNumber: [this.userToEdit.matricule],
      email: this.emailValue,
      login: new FormControl({ value: this.emailValue, disabled: true }),
      siteName: null,
      plantName: null,
      segmentName: null,
      lineName: null,
    });
  }
  save() {
    this.snackbar
      .open(this.translate.instant('usersManagmentContent.successEdit'), 'X', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: 'notif-success'
      })
      .afterOpened()
      .subscribe((res) => {
        this.router.navigateByUrl('/dashboard/users');
      });
  }
}
