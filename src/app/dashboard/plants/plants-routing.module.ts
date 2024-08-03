import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPlantComponent } from './add-plant/add-plant.component';
import { EditPlantComponent } from './edit-plant/edit-plant.component';
import { PlantsComponent } from './plants.component';
import { PlantsListComponent } from './plants-list/plants-list.component';

const routes: Routes = [
  {
    path: '',
    component: PlantsComponent,
    data: {
      breadcrumb: {
        label: 'dashboardContent.plant',
        info :'home'
      },
    },
    children: [
      {
        pathMatch: 'full',
        path: '',
        component: PlantsListComponent,
      },
      {
        path: 'add',
        component: AddPlantComponent,
        data: {
          breadcrumb: {
            label: 'plantContent.AddPlant.addBtn',
          },
        },
      },
      {
        path: 'edit/:id',
        component: EditPlantComponent,
        data: {
          breadcrumb: {
            label: 'plantContent.editPlantForm.edit',
          },
        },
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlantsRoutingModule {}
