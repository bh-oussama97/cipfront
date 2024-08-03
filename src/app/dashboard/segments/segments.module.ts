import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SegmentsRoutingModule } from './segments-routing.module';
import { SegmentsComponent } from './segments.component';
import { AddSegmentComponent } from './add-segment/add-segment.component';
import { EditSegmentComponent } from './edit-segment/edit-segment.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SegmentsListComponent } from './segments-list/segments-list.component';


@NgModule({
  declarations: [
    SegmentsComponent,
    AddSegmentComponent,
    EditSegmentComponent,
    SegmentsListComponent
  ],
  imports: [
    CommonModule,
    SegmentsRoutingModule,
    SharedModule
  ]
})
export class SegmentsModule { }
