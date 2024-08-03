import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlantsModule } from './dashboard/plants/plants.module';
import { StructureModule } from './dashboard/structure/structure.module';
import { SegmentsModule } from './dashboard/segments/segments.module';
import { IdeasModule } from './dashboard/ideas/ideas.module';
import { LinesModule } from './dashboard/lines/lines.module';
import { RankingComponent } from './dashboard/ranking/ranking.component';
import { AuthGuard } from './shared/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'account',
    loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
    canActivate: [AuthGuard],
    canActivateChild : [AuthGuard]
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
  },
  {
    path: 'plants',
    loadChildren: () =>
      import('./dashboard/plants/plants.module').then((m) => PlantsModule),
  },
  {
    path: 'structure',
    loadChildren: () =>
      import('./dashboard/structure/structure.module').then((m) => StructureModule),
  },
  {
    path: 'segments',
    loadChildren: () =>
      import('./dashboard/segments/segments.module').then((m) => SegmentsModule),
  },
  {
    path: 'ideas',
    loadChildren: () => import('./dashboard/ideas/ideas.module').then((m) => IdeasModule),
  },
  {
    path: 'lines',
    loadChildren: () => import('./dashboard/lines/lines.module').then((m) => LinesModule),
  },
  {
    path: 'administration',
    loadChildren: () =>
      import('./dashboard/administration/administration.module').then(
        (m) => m.AdministrationModule
      ),
  },
  {
    path: 'users',
    loadChildren: () =>
      import('./dashboard/users/users.module').then((u) => u.UsersModule),
  },
  {
    path: 'employees',
    loadChildren: () =>
      import('./dashboard/employees/employees.module').then((e) => e.EmployeesModule),
  },
  {
    path: 'ranking',
    component: RankingComponent,
    pathMatch: 'full',
    data: {
      breadcrumb: {
        label: 'headerSection.ideasRanking',
        info: 'home'
      },
    },
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
