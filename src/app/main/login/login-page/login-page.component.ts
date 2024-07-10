import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PoPageLoginAuthenticationType } from '@po-ui/ng-templates';
import { environment } from 'src/environments/environment';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit{
constructor(
  private router: Router ,
  private service: LoginService

){}
user = ''
apiURL = environment.url + '/auth/login'
authenticationType: PoPageLoginAuthenticationType = PoPageLoginAuthenticationType.Bearer;


ngOnInit(): void {
  if ( sessionStorage.getItem('reloadOk') === 'reload'){
    this.router.navigateByUrl(`/main/reserv`)
  }
}
login(credenciais: any) {

  this.doLogin(
    credenciais.login,
    credenciais.password,
    credenciais.rememberUser,

  );
}


doLogin(login: string, password: string, rememberUser: boolean) {
  sessionStorage.setItem('loginUser'   , login);


  this.service.login(login, btoa(password))
    .subscribe(
      (val) => {
        if (val.status === 201 || val.status === 200 ) {
          sessionStorage.setItem('groupAdmin'   , val.admin);
          this.router.navigateByUrl(`/main/home/${new Date().getTime()}`);
        }
      },
      (response) => {
        console.error(response);
      },

    )
}



}
