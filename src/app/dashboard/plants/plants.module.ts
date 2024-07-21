import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlantsRoutingModule } from './plants-routing.module';
import { PlantsComponent } from './plants.component';
import { EditPlantComponent } from './edit-plant/edit-plant.component';
import { AddPlantComponent } from './add-plant/add-plant.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    PlantsComponent,
    EditPlantComponent,
    AddPlantComponent
  ],
  imports: [
    CommonModule,
    PlantsRoutingModule,
    SharedModule
  ]
})
export class PlantsModule { }
