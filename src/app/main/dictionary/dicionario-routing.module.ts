import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DicionarioComponent } from './dicionario.component';
import { DicionarioInfoComponent } from './dicionario-info/dicionario-info.component';
import { DicionarioViewComponent } from './dicionario-view/dicionario-view.component';

const routes: Routes = [
    {
        path: '',
        component: DicionarioComponent,
        children: [{ path: 'info', component: DicionarioInfoComponent }, { path: 'view/:id', component: DicionarioViewComponent }],
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DicionarioRoutingModule { }
