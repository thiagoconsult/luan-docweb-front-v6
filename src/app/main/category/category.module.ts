import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryCreateComponent } from './category-create/category-create.component';
import { CategoryUpdateComponent } from './category-update/category-update.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [CategoryListComponent, CategoryCreateComponent, CategoryUpdateComponent],
  imports: [
    CommonModule,
    CategoryRoutingModule ,
    SharedModule,
    FormsModule
  ]
})
export class CategoryModule { }
