import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DicionarioService } from '../../dictionary/services/dicionario.service';
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
import { withFetch } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { forkJoin } from 'rxjs';
import { AnalysisService } from '../service/analysis.service';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
//import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-analysis-list',
  templateUrl: './analysis-list.component.html',
  styleUrls: ['./analysis-list.component.css']
})
export class AnalysisListComponent {

  analysisData: any;
  currentDate: any;
  analysisId!: any;
  totalPagePdf: any = 0;
  hasPrevious = false;
  page = 1;
  pageSize = 10;
  hasNext = false;

  @ViewChild('modalDictDelete') modalDictDelete?: PoModalComponent ;

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


    pageActions: PoPageAction[] = [
      {
        label: 'Nova Análise',
        action: this.newAnalysis.bind(this),
      },]


      columnsDict: PoTableColumn[] = [
        { property: 'status'  , label: 'Status',
        type: 'label',
        labels: [
          { value: 'concluido', textColor: 'white' ,color: 'color-10', label: 'CONCLUIDO'  , tooltip: 'CONCLUIDO'                },
          { value: 'Processando',textColor: 'white' ,color: 'color-07', label: 'PROCESSANDO', tooltip: 'PROCESSANDO'  },
  
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
        private poNotification: PoNotificationService,
        private analysisService: AnalysisService
    ){}

    ngOnInit(): void {
      this.loadDicionario();
    }

    fetchAnalysisDetails() {

    }

    newAnalysis(){
      this.router.navigateByUrl('main/analysis/create')
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
      this.analysisService.listAnalysis(this.page, this.pageSize).subscribe({
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
         observers.push(this.analysisService.deleteAnalise(row["id_analysis"]));
       }

       forkJoin(observers).subscribe({
         next: () => {
           this.poNotification.success('Excluído com sucesso!');
           this.ngOnInit();
         },
         complete: () => this.isBusy = false
       })
     }

      


    


     generatePDF() {

      const selectedRows = this.itemsSX2.filter( (item: any) => item.$selected);
      for (const row of selectedRows) {
        this.analysisService.getAnalysisDetails(row["id_analysis"]).subscribe(data => {
          this.analysisData = data;
          this.analysisId = row["id_analysis"]
          this.processPDF()
          console.log(`passou aqui`)

        }
      );
      }
      
    }


    generateCsv() {

      const selectedRows = this.itemsSX2.filter( (item: any) => item.$selected);
      for (const row of selectedRows) {
        this.analysisService.getAnalysisDetails(row["id_analysis"]).subscribe(data => {
          this.analysisData = data;
          this.analysisId = row["id_analysis"]
          this.generateExcel()
          console.log(`passou aqui`)

        }
      );
      }
      
    }

    disableProcess(){
      const selectedRowDic = this.itemsSX2.filter((item: any) => item.$selected).length;

      return !(selectedRowDic > 0 );      
    }
      
          closeModal() {
            this.modalDictDelete?.close();
          }


          processPDF() {
            const createAnalysisContent = (pontosAtencao: any[]) => {
                return pontosAtencao.map((ponto: { fonte: string; totalPontos: string; categoria: string; pontoAtencao: string; diferencas: { ambiente: any; tabela: any; chave: any; valor: any; }[]; linhasFonte: any; }) => ([
                    {
                        columns: [
                            { text: 'Fonte: ', style: 'blue' },
                            { text: ponto.fonte, style: 'bodyText', margin: [2, 0, 10, 0] },
                            { text: 'Pontos de atenção: ', style: 'blue' },
                            { text: ponto.totalPontos, style: 'bodyText', margin: [2, 0, 10, 0] },
                            { text: 'Categoria: ', style: 'blue' },
                            { text: ponto.categoria, style: 'bodyText', margin: [2, 0, 10, 0] }
                        ]
                    },
                    { text: 'Ponto de atenção ' + ponto.pontoAtencao, style: 'blue', margin: [0, 10, 0, 0] },
                    { text: 'Diferenças no dicionário:', style: 'blueSub', margin: [20, 10, 0, 0], decoration: 'underline' },
                    {
                        table: {
                            headerRows: 1,
                            widths: ['15%', '15%', '25%', '30%'],
                            body: [
                                [
                                    { text: 'Ambiente', style: 'tableHeader' },
                                    { text: 'Tabela', style: 'tableHeader' },
                                    { text: 'Chave', style: 'tableHeader' },
                                    { text: 'Valor', style: 'tableHeader' }
                                ],
                                ...ponto.diferencas.map((diff: { ambiente: any; tabela: any; chave: any; valor: any; }) => [
                                    { text: diff.ambiente, style: 'tableData' },
                                    { text: diff.tabela, style: 'tableData' },
                                    { text: diff.chave.replace(/\s+/g, ' ').replace(/:\s*/g, ': ').trim(), style: 'tableData' },
                                    { text: diff.valor.replace(/\s+/g, ' ').replace(/:\s*/g, ': ').trim(), style: 'tableData' }
                                ])
                            ]
                        },
                        layout: {
                            hLineWidth: function(i: any, node: any) {
                                return 0;
                            },
                            vLineWidth: function(i: any, node: any) {
                                return 0;
                            },
                            hLineColor: function(i: any, node: any) {
                                return 'transparent';
                            },
                            vLineColor: function(i: any, node: any) {
                                return 'transparent';
                            },
                            paddingLeft: function(i: any, node: any) { return 2; },
                            paddingRight: function(i: any, node: any) { return 2; },
                            paddingTop: function(i: any, node: any) { return 2; },
                            paddingBottom: function(i: any, node: any) { return 2; }
                        },
                        margin: [20, 10, 0, 0]
                    },
                    { text: 'Linhas no fonte:', style: 'blueSub', margin: [20, 10, 0, 0], decoration: 'underline' },
                    { text: ponto.linhasFonte, style: 'bodyText', margin: [20, 5, 0, 0] },
                    { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 770, y2: 5, lineWidth: 0.5, lineColor: '#cccccc' }], margin: [0, 10, 0, 0] },
                    { text: '', margin: [0, 20, 0, 0] }
                ]));
            };
        
            const paginatedContent = [];
            const itemsPerPage = 2;
        
            for (let i = 0; i < this.analysisData.pontosAtencao.length; i += itemsPerPage) {
                if (i > 0) {
                    paginatedContent.push(
                        { text: '', pageBreak: 'before' },
                        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 770, y2: 5, lineWidth: 0.5, lineColor: '#cccccc' }] },

                        {
                            columns: [
                                { text: 'Detalhe', style: 'detailHeader', alignment: 'left' }
                            ],
                            margin: [0, 6]
                        },
                        { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 770, y2: 5, lineWidth: 0.5, lineColor: '#cccccc' }] },
                        { text: '', margin: [0, 6] }
                    );
                }
                const pageContent = createAnalysisContent(this.analysisData.pontosAtencao.slice(i, i + itemsPerPage));
                paginatedContent.push(...pageContent);
            }
        
            const documentDefinition = {
                pageOrientation: 'landscape',
                header: (currentPage: number, pageCount: number): any => {
                    return {
                        columns: [
                            { text: 'ID: ' + this.analysisData.id, style: 'left' },
                            { text: 'Resultado de Análise Cruzada', style: 'header', alignment: 'center' },
                            { text: 'Data da Impressão: ' + this.analysisData.dataImpressao, style: 'right' }
                        ],
                        margin: [40, 10]
                    };
                },
                footer: (currentPage: number, pageCount: number): any => {
                  this.totalPagePdf = pageCount
                  console.log(this.totalPagePdf)
                    return {
                        columns: [
                            { text: 'Página ' + currentPage.toString() + ' de ' + pageCount.toString(), alignment: 'right' }
                        ],
                        margin: [40, 10, 40, 10]
                    };
                },
                content: [
                  { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 770, y2: 5, lineWidth: 0.5, lineColor: '#cccccc' }] },
                
                  {
                    columns: [
                        { text: 'Resumo', style: 'detailHeader', alignment: 'left' }
                    ],
                    margin: [0, 6]
                },
               
                    { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 770, y2: 5, lineWidth: 0.5, lineColor: '#cccccc' }] },
                    { text: '', margin: [0, 6] },
                    {
                      table: {
                        body: [
                            [{ text: 'Dicionário analisado:', style: 'blue', margin: [0, 10, 0, 0] }, { text: this.analysisData.dic, style: 'bodyText', margin: [0, 10, 0, 0] }],
                            [{ text: 'Fontes analisados:', style: 'blue', margin: [0, 10, 0, 0] }, { text: this.analysisData.totalFont.toString(), style: 'bodyText', margin: [0, 10, 0, 0] }],
                            [{ text: 'Pontos de atenção:', style: 'blue', margin: [0, 10, 0, 0] }, { text: this.analysisData.totalPoint.toString(), style: 'bodyText', margin: [0, 10, 0, 0] }],
                            [{ text: 'Fontes sinalizados:', style: 'blue', margin: [0, 10, 0, 0] }, { text: this.analysisData.fontesPoint.toString(), style: 'bodyText', margin: [0, 10, 0, 0] }],
                           // [{ text: 'Páginas:', style: 'blue', margin: [0, 10, 0, 0] }, { text: this.totalPagePdf.toString(), style: 'bodyText', margin: [0, 10, 0, 0] }]
                        ]
                    },
                        layout: 'noBorders',
                        margin: [0, 0, 0, 20]
                    },
                    { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 770, y2: 5, lineWidth: 0.5, lineColor: '#cccccc' }] },

                    { text: '', pageBreak: 'after' },
                    { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 770, y2: 5, lineWidth: 0.5, lineColor: '#cccccc' }] },
                    {
                        columns: [
                            { text: 'Detalhe', style: 'detailHeader', alignment: 'left' }
                        ],
                        margin: [0, 6]
                    },
                    { canvas: [{ type: 'line', x1: 0, y1: 5, x2: 770, y2: 5, lineWidth: 0.5, lineColor: '#cccccc' }] },
                    { text: '', margin: [0, 6] },
                    ...paginatedContent
                ],
                styles: {
                    header: {
                        fontSize: 18,
                        color: '#1f4e78',
                        bold: true,
                        margin: [0, 0, 0, 10]
                    },
                    left: {
                        fontSize: 10,
                        color: 'black',
                        alignment: 'left'
                    },
                    right: {
                        fontSize: 10,
                        color: 'black',
                        alignment: 'right'
                    },
                    bodyText: {
                        fontSize: 10,
                        color: 'black'
                    },
                    blue: {
                        color: '#1f4e78',
                        bold: true,
                        fontSize: 10
                    },
                    blueSub: {
                        color: '#0d3a58',
                        textDecoration: 'underline',
                        bold: true,
                        fontSize: 10
                    },
                    tableHeader: {
                        fontSize: 10,
                        bold: true,
                        color: '#1f4e78',
                        fillColor: '#ffffff',
                        alignment: 'left'
                    },
                    tableData: {
                        fontSize: 10,
                        color: 'black',
                        alignment: 'left',
                        margin: [0, 2, 0, 2]
                    },
                    detailHeader: {
                        fontSize: 14,
                        color: '#1f4e78',
                        bold: true,
                    },
                    tableExample: {
                        margin: [0, 5, 0, 15]
                    }
                }
            };
        
            pdfMake.createPdf(documentDefinition).download(`${this.analysisId}.pdf`);
        }
           
          
        generateExcel() {
          const resumo = [
            ['ID:', this.analysisData.id],
            ['Data da Impressão:', this.analysisData.dataImpressao],
            ['Dicionário analisado:', this.analysisData.dic],
            ['Fontes analisados:', this.analysisData.totalFont],
            ['Pontos de atenção:', this.analysisData.totalPoint],
            ['Fontes sinalizados:', this.analysisData.fontesPoint],
          ];
      
          const detalhe = [
            ['Fonte', 'Total de Pontos de Atenção', 'Ponto de Atenção', 'Ambiente', 'Tabela', 'Chave', 'Valor', 'Linhas do fonte']
          ];
      
          this.analysisData.pontosAtencao.forEach((ponto: { diferencas: any[]; fonte: string; totalPontos: string; pontoAtencao: string; linhasFonte: string; }) => {
            ponto.diferencas.forEach(diferenca => {
              detalhe.push([
                ponto.fonte,
                ponto.totalPontos,
                ponto.pontoAtencao,
                diferenca.ambiente,
                diferenca.tabela,
                diferenca.chave,
                diferenca.valor,
                ponto.linhasFonte
              ]);
            });
          });
      
          const wsResumo: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(resumo);
          const wsDetalhe: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(detalhe);
      
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, wsResumo, 'Resumo');
          XLSX.utils.book_append_sheet(wb, wsDetalhe, 'Detalhe');
      
          XLSX.writeFile(wb, 'AnaliseCruzada.xlsx');
        }
      }
          

