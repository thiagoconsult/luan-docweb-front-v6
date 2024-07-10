import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FonteRoutingModule } from './fonte-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FonteInfoComponent } from './fonte-info/fonte-info.component';

import { FonteDetailComponent } from './fonte-detail/fonte-detail.component';
import { HistComponent } from './hist/hist.component';
import { FonteComponent } from './fonte/fonte.component';

@NgModule({
  declarations: [FonteInfoComponent, FonteDetailComponent, HistComponent, FonteComponent],
  imports: [CommonModule, FonteRoutingModule, SharedModule],
})
export class FonteModule {}
