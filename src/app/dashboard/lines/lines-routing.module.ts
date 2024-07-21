import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinesComponent } from './lines.component';
import { AddLineComponent } from './add-line/add-line.component';
import { EditLineComponent } from './edit-line/edit-line.component';

const routes: Routes = [
  {
    path : '',
      component : LinesComponent,
      pathMatch : 'full',
      data: {
        breadcrumb: {
          label: 'Lines',
        }
      }
  },
  {
    path: 'add',
    component : AddLineComponent,
    data: {
      breadcrumb: {
        label: 'Add'
      }
    }
  },
  {
    path : 'edit/:id',
    component : EditLineComponent,
    data: {
      breadcrumb: {
        label: 'Edit',
      }
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LinesRoutingModule { }
