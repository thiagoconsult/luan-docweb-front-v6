import { Component } from '@angular/core';
import { PoBreadcrumb, PoDynamicFormField } from '@po-ui/ng-components';
import { PoPageDynamicEditActions } from '@po-ui/ng-templates';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {

constructor( 
  private authService: LoginService,
  private router: Router


){

};

title = 'Novo usuário'

public readonly breadcrumb: PoBreadcrumb = {
  items: [{ label: 'Usuários', link: '/main/login/users' }, { label: 'Novo Usuário' }]
};

public readonly actions: PoPageDynamicEditActions = {
  save: this.saveUser.bind(this)
};


public readonly fields: Array<any> = [
  {divider: 'dados', property: 'id', label: 'User ID', key: true, required: true , placeholder:'Id do usuário'},
  { property: 'nome', label: 'Nome',gridColumns: 4 ,placeholder:'Digite o nome usuário'},
  { property: 'email', label: 'E-mail',gridColumns: 5, icon: 'po-icon-mail' ,placeholder:'Digite o e-mail usuário'},
  { property: 'secretkey',label:'Senha' ,required: true, secret: true,placeholder:'Informe a senha ' },
  
  {
    property: 'group',
    gridColumns: 5,
    label: 'Perfil',
    required: true,
    placeholder:'Selecione o perfil do usuário',
    options: [

      { group: 'Administrador', code: 'adm' },
      { group: 'Desenvolvedor', code: 'dev' },
      { group: '', code: '' },
      { group: '', code: '' },

    ],
    fieldLabel: 'group',
    fieldValue: 'code'
  },


];

saveUser(data: any){
  
  console.log(data)
  if (data.group === 'adm') {
    data.admin = true;
  } else if (data.group === 'dev') {
    data.admin = false;
  }
 
  if (!this.validateEmail(data.email)) {
    alert('Por favor, insira um endereço de e-mail válido.');
    return;
  }

  this.authService.saveUser(data).subscribe({
    next: (response) => {
      console.log('Resposta do servidor:', response.message);

      this.router.navigateByUrl('/main/login/users')
    },
    error: (error) => {
      console.error('Erro ao salvar usuário', error);
    }
  });
}

validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
}

}
