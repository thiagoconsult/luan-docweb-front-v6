import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';
import * as moment from 'moment';
import { PoNotificationService, PoUploadFile } from '@po-ui/ng-components';
import { FormGroup } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  constructor(private http: HttpClient) {}


async getFontesPermitidas(): Promise<string[]> {
    const user : any = sessionStorage.getItem('loginUser' ); 
    let params = new HttpParams()
    .set('dev', user)    
    try {
        const response : any = await this.http.get<any[]>(`${environment.url}/reserv/validUpload`, {params}).toPromise();
        return response.map((fonte: { fonte: any; }) => fonte.fonte);
    } catch (error) {
        console.error("Erro ao buscar fontes permitidas:", error);
        return [];
    }
}

processUploadSource(myFormFonte: FormGroup, fontesPermitidas: string[] , lValidOk: boolean): Promise<any[]> {
  return new Promise(async (resolve) => {
      const arquivosValidos = [];
      const isAdmin = sessionStorage.getItem('groupAdmin') === 'true';

      if (myFormFonte.value.fonte[0].extension !== '.zip') {
          const zip = new JSZip();
          for (const fonte of myFormFonte.value.fonte) {
              if (isAdmin || fontesPermitidas.includes(fonte.name) || lValidOk) {
                  zip.file(fonte.name, fonte.rawFile);
              }
          }

          if (Object.keys(zip.files).length > 0) {
              const zipContent = await zip.generateAsync({ type: 'blob' });
              const base64 = await this.toBase64(zipContent);
              arquivosValidos.push({
                  file_name: 'arquivo_zip.zip',
                  base64: base64,
                  mime_type: 'application/zip',
                  fonte: 1
              });
          }
      } else {
          for (const fonte of myFormFonte.value.fonte) {
              if (isAdmin || fontesPermitidas.includes(fonte.name) || lValidOk) {
                  const base64 = await this.toBase64(fonte.rawFile);
                  arquivosValidos.push({
                      file_name: fonte.name,
                      base64: base64,
                      mime_type: fonte.rawFile.type,
                      fonte: 1
                  });
              }
          }
      }

      resolve(arquivosValidos);
  });
}


  
  async toBase64(file: Blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            let cleanData = reader.result
                ?.toString()
                .split(';base64,')
                .pop();
            resolve(cleanData);
        };
        reader.onerror = reject;
    });
}
}