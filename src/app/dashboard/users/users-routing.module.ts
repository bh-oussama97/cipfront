import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UsersListComponent } from './users-list/users-list.component';

const routes: Routes = [
  {
 path : '',
 component : UsersComponent,
 data: {
  breadcrumb: {
    label: 'headerSection.gestionUsers',
    info : 'home'
  }
},
children :[
  {
    path :'',
    component : UsersListComponent,
    pathMatch : 'full'
  },
  {
    path : 'add',
    component : AddUserComponent,
    data: {
      breadcrumb : {
        label: 'usersManagmentContent.addNewUser'
      }
    }
  },
  {
    path : 'edit/:matricule',
    component : EditUserComponent,
    data: {
      breadcrumb : {
        label: 'usersManagmentContent.edit'
      }
    }
  }
]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
