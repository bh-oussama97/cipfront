import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StructureComponent } from './structure.component';
import { EditStructureComponent } from './edit-structure/edit-structure.component';
import { AddStructureComponent } from './add-structure/add-structure.component';
import { StructuresListComponent } from './structures-list/structures-list.component';

const routes: Routes = [
  {
    path: '',
    component: StructureComponent,
    data: {
      breadcrumb: {
        label: 'headerSection.structure',
        info : 'home'
      },
    },
    children: [
      {
        path: '',
        component: StructuresListComponent,
        pathMatch: 'full',
      },
      {
        path: 'edit/:id',
        component: EditStructureComponent,
        data: {
          breadcrumb: {
            label: 'structureContent.editSiteForm.edit',
          },
        },
      },
      {
        path: 'add',
        component: AddStructureComponent,
        data: {
          breadcrumb: {
            label: 'structureContent.addSite.add',
          },
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StructureRoutingModule {}
