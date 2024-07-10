import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const apiURL = `${environment.url}/auth`;


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  constructor(private http: HttpClient) {}

 getUsers(){
    return this.http.get<any>(`${apiURL}/users`)
  }
  login(login: string, password: string): Observable<any> {
    return this.http.post(`${apiURL}/login`, { login, password });
  };
  saveUser(userData: any): Observable<any> {
    return this.http.post(`${apiURL}/users`, userData);
  };

  updateUser(id: string, userData: any): Observable<any> {
    return this.http.post(`${apiURL}/users/${id}`, userData);
  }

  delete(id: string){
    return this.http.delete(`${apiURL}/users/${id}`);
  }

}
