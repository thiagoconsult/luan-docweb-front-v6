import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DicionarioService } from '../services/dicionario.service';
import {
    PoBreadcrumb,
    PoBreadcrumbItem,
    PoDialogService,
    PoModalAction,
    PoModalComponent,
    PoNotificationService,
    PoPageAction,
    PoTableAction,
    PoTableColumn,
} from '@po-ui/ng-components';
import * as XLSX from 'xlsx';
import { forkJoin } from 'rxjs';



@Component({
    selector: 'app-dicionario-info',
    templateUrl: './dicionario-info.component.html',
    styleUrls: ['./dicionario-info.component.css'],
})
export class DicionarioInfoComponent {

  @ViewChild('modalDictDelete') modalDictDelete?: PoModalComponent ;

    page = 1;
    pageSize = 10;
    hasNext = false;
    hasPrevious = false;
    confirm: PoModalAction = {
      action: () => {
        this.onDeleteSelected();
      },
      label: 'Confirmar',
      danger: true
    };
    

    close: PoModalAction = {
      action: () => {
        this.closeModal();
      },
      label: 'Cancelar',
    
    };

    isHideLoading: boolean = true;
    isHideLoadingExportar: boolean = true;


    actions: Array<PoTableAction> = [
        {
            action: (row: any) => this.router.navigate(["main/dicionario/view", row.id_analysis]),
          label: 'Visualizar ',
          
        },


      ];

      columnsDict: PoTableColumn[] = [
        { property: 'status'  , label: 'Status',
        type: 'label',
        labels: [
          { value: 'concluído', textColor: 'white' ,color: 'color-10', label: 'CONCLUIDO'  , tooltip: 'CONCLUIDO'                },
          { value: 'processando',textColor: 'white' ,color: 'color-07', label: 'PROCESSANDO', tooltip: 'PROCESSANDO'  },
  
        ]},
  
        { property: 'id_analysis'  , label: 'ID Análise'},

    ]

    type = 'default'
    itemsSX2 =  [];
    
    
      public readonly breadcrumb: PoBreadcrumb = {
        items: [{ label: 'Dicionários', link: '/' }]
      };


    percentDone: number = 0;

    filterText!: string;
    items: any = [];
    accordionItems: any[] = [];
    exportedData: any[] = [];

    uuid!: string;
    label!: string;

    poBreadcrumbItem: PoBreadcrumbItem[] = [];
    
    isBusy: boolean | undefined;

    constructor(
        private router: Router,
        private dicionarioService: DicionarioService,
        private poNotification: PoNotificationService
    ) {}

    ngOnInit(): void {
      this.loadDicionario();
    }

    disableProcess(){
      const selectedRowDic = this.itemsSX2.filter((item: any) => item.$selected).length;

      return !(selectedRowDic > 0 );      
    }

    updateBreadcrumb() {
        this.poBreadcrumbItem = [
            {
                label: 'Dicionários',
                link: `/main/dicionario/`,
            },
            {
                label: `${this.label}`,
                link: `/main/fonte/dicionario/${this.uuid}`,
            },
        ];
    }


    loadDicionario() {
      this.isHideLoading = false;
      this.items = [];
      this.dicionarioService.getHist(this.page, this.pageSize).subscribe({
          next: (result: any) => {
              this.itemsSX2 = result.data;
              this.hasNext = result.hasNext;
              this.isHideLoading = true;
              this.hasPrevious = this.page > 1;
              console.log(result.hasNext)
          },
          error: (error) => {
              this.isHideLoading = true;
              console.error("Erro ao carregar dados", error);
          },
      });
  }

    loadNextPage() {
      if (this.hasNext) {
          this.page++;
          this.loadDicionario();
      }
  }

  loadPreviousPage() {
      if (this.page > 1) {
          this.page--;
          this.loadDicionario();
      }
  }

    refresh(){
      this.loadDicionario() 
    }
    onFilter(args: string) {
        this.accordionItems = this.items.filter((value: any) => {
            return value.tabela
                .toLowerCase()
                .trim()
                .startsWith(args.toLowerCase().trim());
        });
    }

    onViewTable(idx: number, uuid: string, tabela: string) {
        this.dicionarioService.getDiff(uuid, tabela).subscribe({
            next: (result: any): void => {
                this.accordionItems[idx].diffs = result.items;
            },
        });
    }


    abrirModal() {
      this.modalDictDelete?.open();
    }
  
    confirmAction() {
      // Sua lógica de confirmação aqui
      this.modalDictDelete?.close();
    }
  

    public onDeleteSelected() {
      
      this.closeModal()
       this.isBusy = true;
       const selectedRows = this.itemsSX2.filter( (item: any) => item.$selected);
       const observers = [];
       for (const row of selectedRows) {
         observers.push(this.dicionarioService.deleteAnalise(row["id_analysis"]));
       }

       forkJoin(observers).subscribe({
         next: () => {
           this.poNotification.success('Excluído com sucesso!');
           this.ngOnInit();
         },
         complete: () => this.isBusy = false
       })
     }

      


      exportPlanilha(){

        const selectedRows = this.itemsSX2.filter( (item: any) => item.$selected);
            
            for (const row of selectedRows) {

                this.initializeTableItemsAndGenerateSheet(row["id_analysis"])
             
            }
    
 
          }

          initializeTableItemsAndGenerateSheet(id: any ) {
            if (id ) {
              this.dicionarioService.getreturnAnalysis(id).subscribe({
                next: (result: any) => {
                  this.gerarPlanilhaComDados(result, id );
                },
                error: (error) => console.error('Erro ao buscar dados:', error),
              });
            } else {
              console.error('Um ou mais parâmetros necessários estão faltando.');
            }
          }
          
          private gerarPlanilhaComDados(dados: any, id: any) {
            const wb: XLSX.WorkBook = XLSX.utils.book_new();
          
            Object.keys(dados).forEach((tabela) => {
              let nomeAba = tabela.replace(/\s+/g, '').substring(0, 31); // Remove todos os espaços e limita a 31 caracteres
          
              const dadosFormatados = dados[tabela].map((item: any) => {
                const { id, diferencas, dict, isOk, ...resto } = item;
          
                // Formata "diferencas"
                const diferencasFormatadas = diferencas ? Object.entries(diferencas)
                  .map(([chave, valor]) => `${chave}: ${valor}`)
                  .join(', ') : '';
          
                // Novo objeto com a ordem das colunas desejada e sem a coluna 'isOk'
                const novoItem = {
                  sequencia: item.sequencia, // Assumindo que 'sequencia' é uma das propriedades do item
                  instalacao: item.instalacao, // Assumindo que 'instalacao' é uma das propriedades do item
                  tabela: nomeAba, // 'tabela' é o nome da aba
                  chave: item.chave, // 'chave' é o valor formatado de 'diferencas'
                  Dif: item.dif.trim() // Assumindo que 'dif' é uma das propriedades do item
                };
          
                return novoItem;
              });
          
              const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dadosFormatados, {
                header: ["sequencia", "instalacao", "tabela", "chave", "Dif"], // Define a ordem das colunas
                skipHeader: false // Pula a linha do cabeçalho para usar a personalizada
              });
          
              // Define manualmente a linha do cabeçalho para garantir a ordem das colunas
              XLSX.utils.sheet_add_aoa(ws, [
                ["SEQUENCIA", "DICIONARIO", "TABELA", "CHAVE", "COLUNAS DIVERGENTES"]
              ], { origin: "A1" });
          
              XLSX.utils.book_append_sheet(wb, ws, nomeAba);
            });
          
            // Gera o arquivo Excel e inicia o download
            XLSX.writeFile(wb, `analise_${id.replace(/:/g, '_')}.xlsx`);
          }
          
        
          closeModal() {
            this.modalDictDelete?.close();
          }
        
      
}
