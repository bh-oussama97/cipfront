import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlantsRoutingModule } from './plants-routing.module';
import { PlantsComponent } from './plants.component';
import { EditPlantComponent } from './edit-plant/edit-plant.component';
import { AddPlantComponent } from './add-plant/add-plant.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PlantsListComponent } from './plants-list/plants-list.component';


@NgModule({
  declarations: [
    PlantsComponent,
    EditPlantComponent,
    AddPlantComponent,
    PlantsListComponent
  ],
  imports: [
    CommonModule,
    PlantsRoutingModule,
    SharedModule
  ]
})
export class PlantsModule { }
