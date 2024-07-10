import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main/main.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,


    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login',
      },

      
      {
        path: 'login',
        loadChildren: () =>
          import('./login/login.module').then((module) => module.LoginModule),
      },
      
      {
        path: 'home/:timestamp',
        loadChildren: () =>
          import('./home/home.module').then((m) => m.HomeModule),
      },
      {
        path: 'dicionario',
        loadChildren: () =>
          import('./dictionary/dicionario.module').then(
            (module) => module.DicionarioModule
          ),
      },
      {
        path: 'analysis',
        loadChildren: () =>
          import('./analysis/analysis.module').then(
            (module) => module.AnalysisModule
          ),
      },
      {
        path: 'category',
        loadChildren: () =>
          import('./category/category.module').then((module) => module.CategoryModule),
      },
      {
        path: 'fonte',
        loadChildren: () =>
          import('./fonte/fonte.module').then((module) => module.FonteModule),
      },
      {
        path: 'hist',
        loadChildren: () =>
          import('./fonte/fonte.module').then((module) => module.FonteModule),
      },
      {
        path: 'reserv',
        loadChildren: () =>
          import('./reserv/reserv.module').then((module) => module.ReservModule),
      },


    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MainRoutingModule {}
