import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main/main.component';
import { SharedModule } from '../shared/shared.module';
import { ReservHomeComponent } from './reserv/reserv-home/reserv-home.component';
import { HistComponent } from './historic/hist/hist.component';




@NgModule({
    declarations: [MainComponent, HistComponent],
    imports: [CommonModule, MainRoutingModule, SharedModule],
})
export class MainModule { }
