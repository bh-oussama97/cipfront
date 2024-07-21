import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IdeasComponent } from './ideas.component';
import { IdeaDetailsComponent } from './idea-details/idea-details.component';
import { ValidateIdeaComponent } from './validate-idea/validate-idea.component';
import { SelectIdeaComponent } from './select-idea/select-idea.component';
import { ExecuteIdeaComponent } from './execute-idea/execute-idea.component';

const routes: Routes = [{
  path : '',
    component : IdeasComponent,
    pathMatch : 'full',
    data: {
      breadcrumb: {
        label: 'Ideas',
      }
    }
},
{
  path: 'details/:ideaId',
  component : IdeaDetailsComponent,
  data: {
    breadcrumb: {
      label: 'Details'
    }
  }
},
{
  path: 'preselection',
  component : ValidateIdeaComponent,
  data: {
    breadcrumb: {
      label: 'Pre-Selection'
    }
  }
},
{
  path: 'selection',
  component : SelectIdeaComponent,
  data: {
    breadcrumb: {
      label: 'Selection'
    }
  }
},
{
  path: 'execution',
  component : ExecuteIdeaComponent,
  data: {
    breadcrumb: {
      label: 'Execution'
    }
  }
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IdeasRoutingModule { }
