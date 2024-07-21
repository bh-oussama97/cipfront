import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPlantComponent } from './add-plant/add-plant.component';
import { EditPlantComponent } from './edit-plant/edit-plant.component';
import { PlantsComponent } from './plants.component';

const routes: Routes = [
  {
    path : '',
    component : PlantsComponent,
    pathMatch : 'full',
    data: {
      breadcrumb: {
        label: 'Plants',
      }
    }
  },
  {
    path: 'add',
    component : AddPlantComponent,
    data: {
      breadcrumb: {
        label: 'Add'
      }
    }
  },
  {
    path : 'edit/:id',
    component : EditPlantComponent,
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
export class PlantsRoutingModule { }
