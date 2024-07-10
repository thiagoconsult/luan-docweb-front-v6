import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservRoutingModule } from './reserv-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';
import { ReservHomeComponent } from './reserv-home/reserv-home.component';




@NgModule({
  declarations: [ReservHomeComponent],
  imports: [
    CommonModule,
    ReservRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class ReservModule { }
