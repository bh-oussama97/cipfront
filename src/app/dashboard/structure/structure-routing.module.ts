import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StructureComponent } from './structure.component';
import { EditStructureComponent } from './edit-structure/edit-structure.component';
import { AddStructureComponent } from './add-structure/add-structure.component';

const routes: Routes = [
  {
    path : '',
    component : StructureComponent,
    pathMatch : 'full',
    data: {
      breadcrumb: {
        label: 'Structure',
      }
    }
    
  },
  {
    path : 'edit/:id',
    component : EditStructureComponent,
    data: {
      breadcrumb: {
        label: 'Edit',
      }
    }
  },
  {
    path : 'add',
    component : AddStructureComponent,
    data: {
      breadcrumb: {
        label: 'Add',
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StructureRoutingModule { }
