import { Component, OnInit, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PoTableAction , PoModalComponent} from '@po-ui/ng-components';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HistService } from '../service/hist.service';
import { FonteService } from '../../fonte/services/fonte.service';

@Component({
  selector: 'app-hist',
  templateUrl: './hist.component.html',
  styleUrls: ['./hist.component.css']
})
export class HistComponent implements OnInit {
  @ViewChild('poModal') poModal!: PoModalComponent;

  constructor(  
    private histService: HistService, 
    private fonteService: FonteService,
    private fb: UntypedFormBuilder,
    private router: Router,
  ){

    this.createReactiveForm();
  }
  currentSource: string = '';
  modalSize = 'lg'; // Definir o tamanho do modal conforme necessári
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
    { property: 'source'   , label:'Conteudo', visible: false},
    { property: 'createdAt', label: 'Data'   , type: 'date'},
    { property: 'commit'     , label:'Mensagem'},

]

actions: Array<PoTableAction> = [
  {
    action: (row: any) => this.viewFonte([row.source]),
  label: 'Visualizar', icon:'po-icon po-icon-eye'

},
  {
      action: (row: any) => this.downloadFile([ row.fonte] ,  [row.source]),
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


    loadFonte() {
      this.histService.getHist(this.uuid, this.search).subscribe({
        next: (data) => {

          this.fontes = data.items; // Supondo que a API retorna diretamente a lista
        },
        error: (error) => console.error('Erro ao carregar fontes:', error)
      });
    }
  

    downloadFile(arquivo: any , source: any) {
      const content = source;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = arquivo;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
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

    viewFonte(source: any): void {

      this.currentSource = source; // Atribui o source atual para exibição
      console.log(this.currentSource)
      this.poModal.open(); // Abre o modal

    }
}
