import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  passwordForm: FormGroup;
  emailForm: FormGroup;
  constructor(private fb: FormBuilder) {

  }
  ngOnInit(): void {
    this.passwordForm = this.fb.group({
      password: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmNewPassword: ['', Validators.required]
    });
    this.emailForm = this.fb.group({
      email: ['', Validators.required],
    })
  }

  changePassword(){
    // TODO document why this method 'changePassword' is empty  
  }
  changeEmail(){
    // TODO document why this method 'changeEmail' is empty
  
    
  }
}
