import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SegmentsComponent } from './segments.component';
import { AddSegmentComponent } from './add-segment/add-segment.component';
import { EditSegmentComponent } from './edit-segment/edit-segment.component';
import { SegmentsListComponent } from './segments-list/segments-list.component';

const routes: Routes = [
  {
    path : '',
    component : SegmentsComponent,
    data: {
      breadcrumb: {
        label: 'dashboardContent.segment',
        info :'home'
      }
    },
    children:[
      {
        path:'',
        pathMatch : 'full',
        component : SegmentsListComponent
      },
      {
        path: 'add',
        component : AddSegmentComponent,
        data: {
          breadcrumb: {
            label: 'segementsContent.addSegmentForm.add'
          }
        }
      },
      {
        path : 'edit/:id',
        component : EditSegmentComponent,
        data: {
          breadcrumb: {
            label: 'segementsContent.editSegmentForm.edit',
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
export class SegmentsRoutingModule { }
