import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  DicionarioAPI,
  DicionarioEdit,
  DicionarioGet,
  DicionarioPost,
} from '../model/dicionario';
import { uuid } from '@po-ui/ng-components/lib/utils/util' ;

const apiURL = `${environment.url}/dict`;
const apiURLUpload = `${environment.urlDict}/dict`;


@Injectable({
  providedIn: 'root',
})
export class DicionarioService {
  constructor(private http: HttpClient) {}

  public geraAnalie(uploadData: FormData): Observable<any> {
    return this.http.post<any>(`${apiURLUpload}/upload/`, uploadData);
  }

  public getreturnAnalysis(id:any) {
    // Prepara os parâmetros a serem enviados na solicitação
    let params = new HttpParams()
      .set('id', id);
  
    // Realiza a solicitação GET com os parâmetros
    return this.http.get<any>(`${apiURL}/returnAnalysis`, { params });
  }

  public getHist(page: number, pageSize: number){

    return this.http.get<any>(`${apiURL}/hist?page=${page}&pageSize=${pageSize}`)
  }

  public createAnalysis(id: string) {
    // Criando um objeto com os dados a serem enviados
    const body = { id };
    
    // Realiza a solicitação POST com os dados no corpo
    return this.http.post<any>(`${apiURL}/createAnalysis`, body);
  }

  public deleteAnalise(id: string) {

    let params = new HttpParams()
    .set('id', id);

    return this.http.delete<any>(`${apiURL}`, { params });
  }


 public getDicionarios(params: {
    page?: number;
    pageSize?: number;
  }): Observable<any> {
    let httpParams = new HttpParams();

    return this.http.get<any>(apiURL, {
      params: httpParams,
    });
  }

  public getDicionario(id: string) {
    return this.http.get<any>(`${apiURL}/${id}`, {});
  }

  public getDiff(id: string, tabela: string) {
    return this.http.get<any>(`${apiURL}/diff/${tabela}/${id}`, {});
  }

  public getFields(id: string, tabela: string) {
    return this.http.get<any>(`${apiURL}/fields/${id}/${tabela}`, {});
  }

  public getExport(uuid: string): Observable<Blob> {
    const header = {
      responseType: 'blob' as 'json',
      headers: new HttpHeaders({
        Accept: 'application/zip, application/octet-stream',
      }),
    };

    return this.http.get<Blob>(`${apiURL}/export/${uuid}`, header);
  }

  public postDicionario(dicionarioPost: any) {
    console.dir(dicionarioPost);

    return this.http.post<any>(apiURL, dicionarioPost, {});
  }

  public postUpload(uploadPost: any) {
    console.dir(uploadPost);

    return this.http.post<any>(apiURL, uploadPost, {
      observe: 'events',
      reportProgress: true,
    });
  }

  public editDicionario(id: number, dicionarioEdit: DicionarioEdit) {
    const headers = new HttpHeaders().set(
      'authorization',
      'bearer ' + sessionStorage.getItem('token')
    );
    return this.http.put<DicionarioAPI>(`${apiURL}/${id}`, dicionarioEdit, {
      headers,
    });
  }




  public deleteDicionario(uuid: string) {
    return this.http.delete<any>(`${apiURL}/${uuid}`, {});
  }

  public downloadFile(data: Blob, filename: string) {
    const blob = new Blob([data], { type: 'application/zip' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();

    window.URL.revokeObjectURL(url);
    document.body.removeChild(anchor);
  }
}
