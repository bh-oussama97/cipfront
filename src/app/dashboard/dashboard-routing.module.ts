import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { PlantsModule } from './plants/plants.module';
import { StructureModule } from './structure/structure.module';
import { HomeComponent } from './home/home.component';
import { SegmentsModule } from './segments/segments.module';
import { IdeasModule } from './ideas/ideas.module';
import { LinesModule } from './lines/lines.module';
import { AuthGuard } from '../shared/guards/auth.guard';
import { RankingComponent } from './ranking/ranking.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate :[AuthGuard],
    canActivateChild : [AuthGuard],
    data: {
      breadcrumb: {
        label: 'Dashboard',
        info: 'home',
      }
    },
    children : [
      {
        path : '',
        pathMatch: 'full',
        component : HomeComponent,
        data: { expectedRole: 'ADMIN' }
      },
      {
        path: 'plants',
        loadChildren: () =>
          import('./plants/plants.module').then((m) => PlantsModule),
      },
      {
        path: 'structure',
        loadChildren: () =>
          import('./structure/structure.module').then(
            (m) => StructureModule
          ),
      },
      {
        path: 'segments',
        loadChildren: () =>
          import('./segments/segments.module').then(
            (m) => SegmentsModule
          ),
      },
      {
        path: 'ideas',
        loadChildren: () =>
          import('./ideas/ideas.module').then(
            (m) => IdeasModule
          ),
      },
      {
        path : 'lines',
        loadChildren : () =>  
          import("./lines/lines.module").then( m => LinesModule)
      },
      {
        path : '',
        loadChildren : ()=>
        import('./administration/administration.module').then(m=>m.AdministrationModule)
      },
      {
        path : 'users',
        loadChildren : ()=>
        import('./users/users.module').then(u => u.UsersModule)
      },
      {
        path : 'employees',
        loadChildren : ()=>
        import('./employees/employees.module').then(e => e.EmployeesModule)
      },
      {
        path: 'ranking',
        component: RankingComponent,
        pathMatch: 'full',
        data: {
            breadcrumb: {
                label: 'Ranking',
            }
        },
    }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
