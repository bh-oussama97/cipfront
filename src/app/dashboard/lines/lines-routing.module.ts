import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LinesComponent } from './lines.component';
import { AddLineComponent } from './add-line/add-line.component';
import { EditLineComponent } from './edit-line/edit-line.component';
import { LinesListComponent } from './lines-list/lines-list.component';

const routes: Routes = [
  {
    path: '',
    component: LinesComponent,
    data: {
      breadcrumb: {
        label: 'dashboardContent.li',
        info: 'home',
      },
    },
    children: [
      {
        path: '',
        component: LinesListComponent,
        pathMatch: 'full',
      },
      {
        path: 'add',
        component: AddLineComponent,
        data: {
          breadcrumb: {
            label: 'linesContent.addLineForm.add',
          },
        },
      },
      {
        path: 'edit/:id',
        component: EditLineComponent,
        data: {
          breadcrumb: {
            label: 'linesContent.editLineForm.edit',
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
export class LinesRoutingModule {}
