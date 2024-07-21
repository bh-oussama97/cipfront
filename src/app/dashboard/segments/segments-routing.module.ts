import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SegmentsComponent } from './segments.component';
import { AddSegmentComponent } from './add-segment/add-segment.component';
import { EditSegmentComponent } from './edit-segment/edit-segment.component';

const routes: Routes = [
  {
    path : '',
    component : SegmentsComponent,
    pathMatch : 'full',
    data: {
      breadcrumb: {
        label: 'Segments',
      }
    }
  },
  {
    path: 'add',
    component : AddSegmentComponent,
    data: {
      breadcrumb: {
        label: 'Add'
      }
    }
  },
  {
    path : 'edit/:id',
    component : EditSegmentComponent,
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
export class SegmentsRoutingModule { }
