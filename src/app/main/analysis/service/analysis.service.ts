import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { saveAs } from 'file-saver';
import { Observable } from 'rxjs';
//import jsPDF from 'jspdf';
const apiUrl = `${environment.urlAnalysis}/dict`

@Injectable({
  providedIn: 'root'
})


export class AnalysisService {

  constructor(private http: HttpClient) { }


  processAnalysis(data: any) {
    console.log(data)
    return this.http.post(`${apiUrl}/process-analysis`, data);
  }

  getAnalysisDetails(analysisId: string): Observable<any> {
    let params = new HttpParams().set('analysisId', analysisId);
    return this.http.get(`${apiUrl}/details`, { params });
  }


  public deleteAnalise(id: string) {

    return this.http.delete<any>(`${apiUrl}/${id}`);
  }


  listAnalysis(page: number, pageSize: number) {
    return this.http.get(`${apiUrl}?page=${page}&pageSize=${pageSize}`);
}



}
