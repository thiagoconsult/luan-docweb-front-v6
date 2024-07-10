import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FonteComponent } from './fonte/fonte.component';
import { FonteInfoComponent } from './fonte-info/fonte-info.component';
import { FonteDetailComponent } from './fonte-detail/fonte-detail.component';
import { HistComponent } from './hist/hist.component';



const routes: Routes = [
    {
        path: '',
        component: FonteComponent,
        children: [
            { path: 'info', component: FonteInfoComponent },
            { path: 'detail/:uuid/:id', component: FonteDetailComponent },
            { path: 'hist', component: HistComponent },

        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FonteRoutingModule { }
