import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const apiUrl = `${environment.url}/hist`
@Injectable({
  providedIn: 'root'
})
export class HistService {

  constructor(private http: HttpClient) {}

  public getHist(id: string, search: string) {
    let params = new HttpParams()
    .set('search', search);

    return this.http.get<any>(apiUrl, {params});
}
}
