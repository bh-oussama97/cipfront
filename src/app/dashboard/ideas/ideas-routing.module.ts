import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IdeasComponent } from './ideas.component';
import { IdeaDetailsComponent } from './idea-details/idea-details.component';
import { ValidateIdeaComponent } from './validate-idea/validate-idea.component';
import { SelectIdeaComponent } from './select-idea/select-idea.component';
import { ExecuteIdeaComponent } from './execute-idea/execute-idea.component';
import { AuthGuard } from 'src/app/shared/guards/auth.guard';
import { IdeasListComponent } from './ideas-list/ideas-list.component';

const routes: Routes = [
  {
    path: '',
    component: IdeasComponent,
    data: {
      breadcrumb: {
        label: 'headerSection.id',
        info: 'home',
      },
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: IdeasListComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'details/:ideaId',
        component: IdeaDetailsComponent,
        data: {
          breadcrumb: {
            label: 'headerSection.details',
          },
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'preselection/:ideaId',
        component: ValidateIdeaComponent,
        data: {
          breadcrumb: {
            label: 'headerSection.preselection',
          },
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'selection/:ideaId',
        component: SelectIdeaComponent,
        data: {
          breadcrumb: {
            label: 'headerSection.selection',
          },
        },
        canActivate: [AuthGuard]
      },
      {
        path: 'execution/:ideaId',
        component: ExecuteIdeaComponent,
        data: {
          breadcrumb: {
            label: 'headerSection.execution'
          },
        },
        canActivate: [AuthGuard]
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IdeasRoutingModule {}
