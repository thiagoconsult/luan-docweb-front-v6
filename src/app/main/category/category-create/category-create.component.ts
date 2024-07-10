import { Component } from '@angular/core';
import { FonteService } from '../../fonte/services/fonte.service';
import { Router } from '@angular/router';
import { PoPageDynamicEditActions } from '@po-ui/ng-templates';
import { CategoryService } from '../services/category.service';
import { PoBreadcrumb } from '@po-ui/ng-components';

@Component({
  selector: 'app-category-create',
  templateUrl: './category-create.component.html',
  styleUrls: ['./category-create.component.css']
})
export class CategoryCreateComponent {

constructor( 
  private service: CategoryService,
  private router: Router


){

};

title = 'Nova Categoria'
public readonly breadcrumb: PoBreadcrumb = {
  items: [{ label: 'Categorias', link: '/main/category' }, { label: 'Nova Categoria' }]
};
public readonly actions: PoPageDynamicEditActions = {
  save: this.saveUser.bind(this)
};


public readonly fields: Array<any> = [
  {divider: 'dados', property: 'category', label: 'Categoria', key: true, required: true , placeholder:'Nome da categoria'},
  { property: 'content', label: 'Expressões',gridColumns: 12,gridSmColumns: 12 ,rows: 5,
  placeholder:'Expressões da categoria'},


];

saveUser(data: any){


   this.service.saveCategory(data).subscribe({
     next: (response) => {
       console.log('Resposta do servidor:', response.message);
 
       this.router.navigateByUrl('/main/category')
     },
     error: (error) => {
       console.error('Erro ao salvar usuário', error);
     }
   });
}


}