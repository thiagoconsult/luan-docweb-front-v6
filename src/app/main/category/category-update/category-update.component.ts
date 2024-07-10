import { Component, OnInit, ViewChild } from '@angular/core';
import { PoBreadcrumb, PoDynamicFormComponent, PoDynamicFormField, PoNotificationService } from '@po-ui/ng-components';
import { Location } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-category-update',
  templateUrl: './category-update.component.html',
  styleUrls: ['./category-update.component.css']
})
export class CategoryUpdateComponent implements OnInit{
  @ViewChild(PoDynamicFormComponent, { static: true }) dynamicForm!: PoDynamicFormComponent;
  constructor(
    private notificationService: PoNotificationService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private service: CategoryService
  ){
    
  }

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Categorias', link: '/main/category' }, { label: 'Alterar Categoria' }]
  };
  
  public readonly formFields: PoDynamicFormField[] = [
    {
      label: "Categoria",
      property: "category",
      disabled: true

    },
    {
      label: "Conteudo",
      property: "content",gridColumns: 12,gridSmColumns: 12 ,rows: 5,
      placeholder:'Expressões da categoria'
    },


  ];
  get isFormInvalid(): boolean {
    if (this.dynamicForm)
      return this.dynamicForm.form.invalid as boolean;
    return true;
  }
  ngOnInit(): void {
    const id = this.route.snapshot.params["id"];
    const content = this.route.snapshot.params["content"];
    this.dynamicForm.value = {category: id , content: content}
    
  }

  onSaveClick(): void {


    this.save(this.route.snapshot.params["id"],this.dynamicForm.form.value)
      .subscribe({
        next: () => {
          this.notificationService.success('Alteração salva com sucesso');
          this.router.navigateByUrl('/main/category');
        },
      });
    }


    
    private save(id: string ,data: any ): Observable<any> {

      return this.service.updateCategory(id,data);

    }

  onCancelClick(): void {
    this.location.back();
  }

}
