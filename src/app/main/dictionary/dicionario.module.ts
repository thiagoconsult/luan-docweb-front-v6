import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DicionarioRoutingModule } from './dicionario-routing.module';
import { DicionarioComponent } from './dicionario.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DicionarioInfoComponent } from './dicionario-info/dicionario-info.component';
import { DicionarioViewComponent } from './dicionario-view/dicionario-view.component';

@NgModule({
    declarations: [DicionarioComponent, DicionarioInfoComponent, DicionarioViewComponent],
    imports: [CommonModule, DicionarioRoutingModule, SharedModule],
})
export class DicionarioModule { }
