import { Component, OnInit, ViewChild } from '@angular/core';
import { PoDynamicFormComponent, PoDynamicFormField, PoNotificationService } from '@po-ui/ng-components';
import { Location } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-user-edit-form',
  templateUrl: './user-edit-form.component.html',
  styleUrls: ['./user-edit-form.component.css']
})
export class UserEditFormComponent implements OnInit{
  @ViewChild(PoDynamicFormComponent, { static: true }) dynamicForm!: PoDynamicFormComponent;
  constructor(
    private notificationService: PoNotificationService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private service: LoginService
  ){
    
  }
  public readonly formFields: PoDynamicFormField[] = [
    {
      label: "Usuário",
      property: "id",
      disabled: true

    },
    {
      label: "Nome",
      property: "nome"
    },
    {
      label: "E-mail",
      property: "email"
    },
    {
      label : "Senha",
      property: "secretkey",
      secret: true
    },

  ];
  get isFormInvalid(): boolean {
    if (this.dynamicForm)
      return this.dynamicForm.form.invalid as boolean;
    return true;
  }
  ngOnInit(): void {
    const id = this.route.snapshot.params["id"];
    const nome = this.route.snapshot.params["nome"];
    const email = this.route.snapshot.params["email"];
    this.dynamicForm.value = {id: id , nome: nome , email: email, secretkey: ''}
    
  }

  onSaveClick(): void {

  if (!this.validateEmail(this.dynamicForm.form.value.email)) {
    alert('Por favor, insira um endereço de e-mail válido.');
    return;
  }

    this.save(this.route.snapshot.params["id"],this.dynamicForm.form.value)
      .subscribe({
        next: () => {
          this.notificationService.success('Alteração salva com sucesso');
          this.router.navigateByUrl('/main/login/users');
        },
      });
    }

    validateEmail(email: string): boolean {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
      return emailRegex.test(email);
    }
    
    private save(id: string ,data: any ): Observable<any> {

      return this.service.updateUser(id,data);

    }

  onCancelClick(): void {
    this.location.back();
  }

}
