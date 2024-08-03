import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StructureRoutingModule } from './structure-routing.module';
import { StructureComponent } from './structure.component';
import { EditStructureComponent } from './edit-structure/edit-structure.component';
import { AddStructureComponent } from './add-structure/add-structure.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { StructuresListComponent } from './structures-list/structures-list.component';


@NgModule({
  declarations: [
    EditStructureComponent,
    AddStructureComponent,
    StructureComponent,
    StructuresListComponent
  ],
  imports: [
    CommonModule,
    StructureRoutingModule,
    SharedModule
  ]
})
export class StructureModule { }
