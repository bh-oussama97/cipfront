import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';

const routes: Routes = [
  {
 path : '',
 component : UsersComponent,
 pathMatch : 'full',
 data: {
  breadcrumb: {
    label: 'Users Managment',
  }
},
},
{
  path : 'add',
  component : AddUserComponent,
  data: {
    breadcrumb : {
      label: 'Add new user'
    }
  }
},
{
  path : 'edit/:matricule',
  component : EditUserComponent,
  data: {
    breadcrumb : {
      label: 'Edit'
    }
  }
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
