import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  constructor(private formBuilder: FormBuilder, private snackbar: MatSnackBar,private router:Router) { }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      'newPassword': ['', [Validators.required, Validators.minLength(6)]],
      'confirmNewPassword': ['', [Validators.required, Validators.minLength(6)]]
    })
  }
  save() {
    this.snackbar
      .open('Password changed successfully', 'X', {
        duration: 2000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: 'notif-success'
      })
      .afterDismissed().subscribe((result)=>{
        this.router.navigateByUrl('login');
      })
  }
}
