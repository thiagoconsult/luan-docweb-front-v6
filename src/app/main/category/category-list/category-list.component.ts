import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoNotificationService, PoPageAction, PoTableAction } from '@po-ui/ng-components';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit{
  @ViewChild('modalDelete') modalDelete?: PoModalComponent ;
  constructor(private router: Router, private service: CategoryService, private poNotification: PoNotificationService){
  }
  categoryId : any = ''
  categoryList = [];


  pageActions: PoPageAction[] = [
    {
      label: 'Nova Categoria',
      action: this.addNewCategory.bind(this),
    },]


      columns: any[] = [       

        { property: 'category',    label:'Categorias'},
        { property: 'content'  , label: 'Conteudo', visible: false },
        ]
        
        actions: Array<PoTableAction> = [
          {
              action: (row: any) => this.router.navigate(["main/category/edit", row.category , row.content ]),
            label: 'Alterar ' , icon: 'po-icon po-icon-edit'   
          },
          {
            action: (row: any) => this.openModal(row.category),
          label: 'Excluir ', type:'danger'   , icon:'po-icon po-icon-delete'
        }
        ];

        confirmModalDelete: PoModalAction = {
          action: () => {
            this.deleteUser()
          },
          label: 'Confirmar',
          danger: true
        };
    
        close: PoModalAction = {
          action: () => {
            this.closeModal();
          },
          label: 'Cancelar',
    
        };
        
        
        ngOnInit(): void {
          this.listCategorys()
        }
  
      addNewCategory(){

        this.router.navigateByUrl('/main/category/create')
      }

      openModal(id: string){
          this.categoryId = id

          if (id === 'PONTO DE ENTRADA' || id === 'CLASSES'){
            this.poNotification.error(` Não é possível excluir a categoria ${id}.`)
          } else {
            this.modalDelete?.open()
          }
          
       
        
    }
  
      closeModal() {
        this.modalDelete?.close();
      }



      listCategorys() {
        this.service.listCategory().subscribe({
            next: (result: any) => {
            this.categoryList = result.items;
  
            },
            error: (error) => {},
        });
    }




  deleteUser(){
  
    this.service.delete(this.categoryId).subscribe((value) => {
        if (value) {
            this.poNotification.success(`Categoria ${this.categoryId} deletada com sucesso!`);

            this.closeModal();

            setTimeout(() => {
             this.listCategorys()
                
            }, 300);
        } else {
            this.poNotification.error(
                `Ocorreu um erro ao tentar excluir os registros`
            );
        }
    });
}
  }
  