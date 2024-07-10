import { Component, OnInit, ViewChild , AfterViewInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PoBreadcrumb, PoPageAction, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { DicionarioService } from '../services/dicionario.service';
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-dicionario-view',
  templateUrl: './dicionario-view.component.html',
  styleUrls: ['./dicionario-view.component.css']
})
export class DicionarioViewComponent implements OnInit {

  // Variaveis para armazenar os parametros passados no component dicionario-info
  id: string  = '';



  breadcrumb: PoBreadcrumb | undefined;
  resultTabs: string[] | undefined

  // Variavel para armazenar os dados das tabelas com os resultados da comparações.
  tabelasItems: { [key: string]: any[] } = {};


  pageAction : PoPageAction[] = [

    {
      label: 'Exportar resultados',
      icon: 'po-icon po-icon-doc-xls',
      action: this.initializeTableItemsAndGenerateSheet.bind(this)
    },
  ]

  columnsDict: PoTableColumn[] = [
    { property: 'sequencia', label: 'SEQUENCIA' },
    { property: 'instalacao', label: 'DICIONÁRIO' },
    { property: 'tabela', label: 'TABELA' },
    { property: 'chave', label: 'CHAVE' },
    { property: 'isOk', label: 'OK?' , visible: false},
    {
      property: 'dif',
      label: 'COLUNAS DIVERGENTES',
      type: 'cellTemplate'  // Indica que esta coluna utilizará um template personalizado
    }
  ];


column: any;



Array: any;
  //isHideLoading: boolean ;




constructor(private route: ActivatedRoute, private dicionarioService: DicionarioService ){

}

ngOnInit(): void {
  this.route.params.subscribe(params => {
    this.id = params['id'];

  });


  this.setupBreadcrumb()
  this.initializeTableItems();

}

setupBreadcrumb(): void {


  this.breadcrumb = {
    items: [
      { label: 'Dicionários', link: '/main/dicionario/info' },
      { label: `Visualizar ${this.id} ` }
    ]
  };
}

initializeTableItems() {
  if (this.id) {
    this.dicionarioService.getreturnAnalysis(this.id).subscribe({
      next: (result: any) => {
        // Verifica se o objeto result é vazio (não tem chaves)
        if (Object.keys(result).length === 0) {
          // Configura uma mensagem padrão no objeto result para uma chave genérica 'tabela'
          result['Sem diferenças para essa análise ou ainda em processamento.'] = [{ mensagem: 'Arquivo ainda em análise ou sem dados disponíveis.' }];
        } else {
          // Itera sobre cada chave (tabela) no resultado
          Object.keys(result).forEach((tabela) => {
            // Verifica se result[tabela] é um array e não está vazio
            if (Array.isArray(result[tabela]) && result[tabela].length > 0) {
              // Seu código existente aqui
            } else {
              // Configura uma mensagem padrão para a chave específica que está vazia
              result[tabela] = [{ mensagem: 'Arquivo ainda em análise ou sem dados disponíveis.' }];
            }
          });
        }

        this.tabelasItems = result;
      },
      error: (error) => console.error('Erro ao buscar dados:', error),
    });
  } else {
    console.error('Um ou mais parâmetros necessários estão faltando.');
  }

  setTimeout(() => {
    //this.isHideLoading = true;
  }, 200);
}




initializeTableItemsAndGenerateSheet() {
  if (this.id) {
    this.dicionarioService.getreturnAnalysis(this.id).subscribe({
      next: (result: any) => {
        this.gerarPlanilhaComDados(result);
      },
      error: (error) => console.error('Erro ao buscar dados:', error),
    });
  } else {
    console.error('Um ou mais parâmetros necessários estão faltando.');
  }
}

private gerarPlanilhaComDados(dados: any) {
  const wb: XLSX.WorkBook = XLSX.utils.book_new();

  Object.keys(dados).forEach((tabela) => {
    let nomeAba = tabela.replace(/\s+/g, ''); // Remove todos os espaços

    const dadosFormatados = dados[tabela].map((item: any) => {
      const { id, diferencas, dict, isOk, ...resto } = item;


      const diferencasFormatadas = diferencas ? Object.entries(diferencas)
        .map(([chave, valor]) => `${chave}: ${valor}`)
        .join(', ') : '';

      // Novo objeto com a ordem das colunas desejada e sem a coluna 'isOk'
      const novoItem = {
        sequencia: item.sequencia,
        instalacao: item.instalacao,
        tabela: nomeAba,
        chave: item.chave.replace(/\s/g, ''),
        Dif: item.dif.replace(/\s/g, '')
      };

      return novoItem;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dadosFormatados, {
      header: ["sequencia", "instalacao", "tabela", "chave", "Dif"],
      skipHeader: false
    });

    XLSX.utils.sheet_add_aoa(ws, [
      ["SEQUENCIA", "DICIONARIO", "TABELA", "CHAVE", "COLUNAS DIVERGENTES"]
    ], { origin: "A1" });

    XLSX.utils.book_append_sheet(wb, ws, nomeAba);
  });

  XLSX.writeFile(wb, `analise_${this.id.replace(/:/g, '_')}.xlsx`);
}







objectKeys(obj: any): string[] {
  return Object.keys(obj);
}


}

