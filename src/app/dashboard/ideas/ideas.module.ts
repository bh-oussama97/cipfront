import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IdeasRoutingModule } from './ideas-routing.module';
import { IdeasComponent } from './ideas.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IdeaDetailsComponent } from './idea-details/idea-details.component';
import { ValidateIdeaComponent } from './validate-idea/validate-idea.component';
import { SelectIdeaComponent } from './select-idea/select-idea.component';
import { ExecuteIdeaComponent } from './execute-idea/execute-idea.component';


@NgModule({
  declarations: [
    IdeasComponent,
    IdeaDetailsComponent,
    ValidateIdeaComponent,
    SelectIdeaComponent,
    ExecuteIdeaComponent,
  ],
  imports: [
    CommonModule,
    IdeasRoutingModule,
    SharedModule
  ]
})
export class IdeasModule { }
