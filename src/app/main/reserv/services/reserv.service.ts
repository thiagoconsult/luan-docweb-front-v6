import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const apiURL = `${environment.url}/reserv`;
@Injectable({
  providedIn: 'root'
})
export class ReservService {

  constructor(private http: HttpClient) {}

  public listReserv(page: number, pageSize: number) {
    return this.http.get(`${apiURL}?page=${page}&pageSize=${pageSize}`);
  }

  public listReservPrw(id:number , prw: string) : Observable<any[]> {
    return this.http.get<any[]>(`${apiURL}/${id}/${prw}`);
  }

  public delete(id: number) {

    let params = new HttpParams()
    .set('id', id)      
    return this.http.delete<any>(`${apiURL}`, { params });
}

}
