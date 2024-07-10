import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const apiURL = `${environment.url}/category`;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) {}

  listCategory(){
     return this.http.get<any>(`${apiURL}`)
   }
   login(login: string, password: string): Observable<any> {
     return this.http.post(`${apiURL}/login`, { login, password });
   };
   saveCategory(userData: any): Observable<any> {
     return this.http.post(`${apiURL}`, userData);
   };
 
   updateCategory(id: string, userData: any): Observable<any> {
    
     return this.http.post(`${apiURL}/${id}`, userData);
   }
 
   delete(id: string){
     return this.http.delete(`${apiURL}/${id}`);
   }
 
 }