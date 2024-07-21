import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LinesRoutingModule } from './lines-routing.module';
import { AddLineComponent } from './add-line/add-line.component';
import { EditLineComponent } from './edit-line/edit-line.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { LinesComponent } from './lines.component';


@NgModule({
  declarations: [
    AddLineComponent,
    EditLineComponent,
    LinesComponent
  ],
  imports: [
    CommonModule,
    LinesRoutingModule,
    SharedModule
  ]
})
export class LinesModule { }
