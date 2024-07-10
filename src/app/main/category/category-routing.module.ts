import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryCreateComponent } from './category-create/category-create.component';
import { CategoryUpdateComponent } from './category-update/category-update.component';

const routes: Routes = [

  
     { path: '', component: CategoryListComponent} ,
      { path: 'create', component: CategoryCreateComponent },
      { path: 'edit/:id/:content' ,  component: CategoryUpdateComponent },


    ];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoryRoutingModule { }
