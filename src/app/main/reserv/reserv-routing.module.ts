import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReservHomeComponent } from './reserv-home/reserv-home.component';



const routes: Routes = [
  {path:''       , component: ReservHomeComponent}

 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReservRoutingModule { }
