import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { CreateUserComponent } from './create-user/create-user.component';
import { ListUsersComponent } from './list-users/list-users.component';
import { UserEditFormComponent } from './user-edit-form/user-edit-form.component';


const routes: Routes = [
  {path:''       , component: LoginPageComponent},
 { path: 'create', component: CreateUserComponent },
 { path: 'users' ,  component: ListUsersComponent },
 { path: 'edit/:id/:nome/:email' ,  component: UserEditFormComponent },

 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
