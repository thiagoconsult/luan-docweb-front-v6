import { Component, OnInit, ViewChild } from '@angular/core';
import { Route, Router } from '@angular/router';
import { PoBreadcrumb, PoModalAction, PoModalComponent, PoNotificationService, PoPageAction, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { environment } from 'src/environments/environment';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-list-users',
  templateUrl: './list-users.component.html',
  styleUrls: ['./list-users.component.css']
})
export class ListUsersComponent implements OnInit{
  @ViewChild('modalDelete') modalDelete?: PoModalComponent ;
  constructor(private router: Router, private loginService: LoginService, private poNotification: PoNotificationService, ){}

  userDelete : any = ''
  itemsUsers = []

  breadcrumb : PoBreadcrumb = {
    items: [
      { label: 'Usuários' }
    ]
  };

  pageActions: PoPageAction[] = [
    {
      label: 'Novo usuário',
      action: this.addNewUser.bind(this),
    },]

  columns: any[] = [       
      { property: 'admin' , label: 'Grupo',
      type: 'label',
      labels: [
        { value: true, textColor: 'white' ,color: 'color-02', label: 'ADMINISTRADOR'  , tooltip: 'ADMIN'                },
        { value: false,textColor: 'white' ,color: 'color-12', label: 'DESENVOLVEDOR', tooltip: 'DESENVOLVEDOR'  },

      ]},

        { property: 'id',    label:'Usuário'},
        { property: 'nome', label: 'Nome' },
        { property: 'email', label: 'E-mail' },]

    actions: Array<PoTableAction> = [
      {
          action: (row: any) => this.router.navigate(["main/login/edit", row.id , row.nome , row.email]),
        label: 'Alterar ' , icon: 'po-icon po-icon-edit'   
      },
      {
        action: (row: any) => this.openModal(row.id),
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
      this.loadUsers()
    }

    openModal(id: string){
      this.userDelete = id

      if(id === 'admin') {
        this.poNotification.error('Não é possível excluir o usuário ADMINISTRADOR.')
      }else {
        this.modalDelete?.open()
      }
      
  }

    closeModal() {
      this.modalDelete?.close();
    }

    loadUsers() {
      this.loginService.getUsers().subscribe({
          next: (result: any) => {
          this.itemsUsers = result.items;

          },
          error: (error) => {},
      });
  }



  addNewUser(){
    this.router.navigateByUrl('/main/login/create')
  }

  deleteUser(){
  
    this.loginService.delete(this.userDelete).subscribe((value) => {
        if (value) {
            this.poNotification.success(`Usuário ${this.userDelete} deletado com sucesso!`);

            this.closeModal();

            setTimeout(() => {
             this.loadUsers()
                
            }, 300);
        } else {
            this.poNotification.error(
                `Ocorreu um erro ao tentar excluir os registros`
            );
        }
    });
}

}
