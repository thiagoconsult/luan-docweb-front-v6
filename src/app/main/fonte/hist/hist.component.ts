import { Component, OnInit, ViewChild } from '@angular/core';
import { FonteService } from '../services/fonte.service';
import { environment } from 'src/environments/environment';
import { PoTableAction , PoModalComponent} from '@po-ui/ng-components';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { DownloadService } from 'src/app/services/download/download.service';
import * as diff from 'diff';
import { CodeDiffService } from 'src/app/services/diff/code-diff.service';
@Component({
  selector: 'app-hist',
  templateUrl: './hist.component.html',
  styleUrls: ['./hist.component.css']
})
export class HistComponent implements OnInit {
  @ViewChild('poModal') poModal!: PoModalComponent;
  formattedDiff: any | undefined;
  currentSourceOld: string = `Tetstetets`
  constructor(  
    private fonteService: FonteService, 
    private downloadService: DownloadService,
    private codeDiffService: CodeDiffService,
    private fb: UntypedFormBuilder
  ){

    this.createReactiveForm();
  }

  diffResult: any[] = [];
  sourceCod: any[] = [];

  currentSource: string = '';
  modalSize = 'xl'; // Definir o tamanho do modal conforme necessári
  search: any;
  reactiveForm: UntypedFormGroup | any;
  uuid: string = '9999'
  fontes: any[] = [];
  url: string = `${environment.url}/hist`


  columns: any[] = [
    { property: 'action' , label: 'Ação',
    type: 'label',
    labels: [
      { value: 'CREATE',textColor: 'white' ,color: 'color-10', label: 'CREATE'  , tooltip: 'Fonte incluido.'                },
      { value: 'UPDATE',textColor: 'white' ,color: 'color-02', label: 'UPDATE'  , tooltip: 'Fonte alterado.'  },
      { value: 'DELETE',textColor: 'white' ,color: 'color-07', label: 'DELETE'  , tooltip: 'Fonte excluído.'  },

    ]},
    { property: 'user'     , label:'Usuário'},
    { property: 'fonte'    , label:'Arquivo' , visible: false},
    { property: 'sourceOld'   , label:'sourceOld', visible: false},
    { property: 'source'   , label:'source', visible: false},
    { property: 'createdAt', label: 'Data'   , type: 'date'},
    { property: 'commit'     , label:'Mensagem'},

]

actions: Array<PoTableAction> = [
  {
    action: (row: any) => this.viewFonte([row.source] , [row.sourceOld] , [row.action] ),
  label: 'Visualizar', icon:'po-icon po-icon-eye'

},
  {
      action: (row: any) => this.downloadService.downloadFile([ row.fonte] ,  [row.source]),
    label: 'Download', icon:'po-icon po-icon-download'

  },


];

  ngOnInit(): void { this.fonteService.getFontes({}).subscribe({
            next: (data) => {
                // Verifica se data.items não está vazio
                if (data.items && data.items.length > 0) {
                    data.items.forEach((item: any) => {
                        if (!item.uuid || item.uuid.trim() === '') {
                            this.loadFonte();
                        } else {
                            this.uuid = item.uuid
                            this.loadFonte();
                        }
                    });
                } else {
                    // Se data.items estiver vazio envio uuid aleatorio
                   this.loadFonte();
                }
            },
            error: (error) => {
                console.error(error);
            },
        });
    }

    generateDiff(oldText: string, newText: string): string {
      const dif = diff.diffLines(oldText, newText);
      let formattedDiff = '';
  
      dif.forEach((part: any) => {
        const color = part.added ? 'green' : part.removed ? 'red' : 'grey';
        const symbol = part.added ? '+' : part.removed ? '-' : ' ';
        formattedDiff += `<span style="color: ${color};">${symbol} ${part.value}</span>`;
      });
  
      return formattedDiff;
    }

    loadFonte() {
      this.fonteService.getHist(this.uuid, this.search).subscribe({
        next: (data) => {

          this.fontes = data.items; // Supondo que a API retorna diretamente a lista
        },
        error: (error) => console.error('Erro ao carregar fontes:', error)
      });
    }
  


    updateField(){

      this.search = this.reactiveForm.get('search').value;
    
      this.loadFonte()
      
    }

    createReactiveForm() {
      this.reactiveForm = this.fb.group({
          search: ['', Validators.compose([ Validators.minLength(6), Validators.maxLength(100)])],
    
      });
    }

    expandAccordion(fonte: any) {
      fonte.isExpanded = true;  // Marca o item como expandido
    }
    
    collapseAccordion(fonte: any) {
      fonte.isExpanded = false;  // Marca o item como não expandido
    }
    
    getUrl(fonte: string): string {
      return `${this.url}/${fonte}`;  // Formata a URL para a API do po-table
    }

    viewFonte(source: any , sourceOld: any , action: any): void {
      this.sourceCod = this.codeDiffService.compareCodeVersions( source[0] ,  source[0])

      if(action[0] === 'CREATE'){
        this.diffResult = this.codeDiffService.compareCodeVersions( source[0] ,  source[0])
      } else if (action[0] === 'UPDATE'){
        this.diffResult = this.codeDiffService.compareCodeVersions( sourceOld[0] ,  source[0])

      }
      
      this.poModal.open(); // Abre o modal

    }

    


}
