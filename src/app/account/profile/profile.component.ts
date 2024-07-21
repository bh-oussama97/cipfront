import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{

  profileForm:FormGroup;
  loggedInUser:any;

  constructor(private fb:FormBuilder){

  }
  ngOnInit(): void {
    // this.loggedInUser = jwtDecode(localStorage.getItem('cip_token'));
    this.profileForm = this.fb.group({
      firstName : ['',[Validators.required]],
      lastName : ['',Validators.required],
      email : ['',Validators.required],
      login: new FormControl({ value: '', disabled: true }),
    })
  }

  saveChanges(){
    // TODO document why this method 'saveChanges' is empty
  }

}
