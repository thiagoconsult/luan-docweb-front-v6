import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  PoModalAction,
  PoModalComponent,
  PoNotificationService,
  PoTableAction,
  PoTableColumn,
  PoUploadLiterals
} from '@po-ui/ng-components';
import { FormBuilder, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import * as JSZip from 'jszip';
import { v4 as uuidv4 } from 'uuid';

import { ReservService } from '../services/reserv.service';
import { DownloadService } from 'src/app/services/download/download.service';
import { CodeDiffService } from 'src/app/services/diff/code-diff.service';
import { UploadService } from 'src/app/services/upload/upload.service';
import { FonteService } from '../../fonte/services/fonte.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reserv-home',
  templateUrl: './reserv-home.component.html',
  styleUrls: ['./reserv-home.component.css']
})
export class ReservHomeComponent implements OnInit {
  @ViewChild('modalUpload') modalUpload!: PoModalComponent;
  @ViewChild('modalDelete') modalDelete!: PoModalComponent;
  @ViewChild('poModal') poModal!: PoModalComponent;

  // Session variables

  loginUser = sessionStorage.getItem('loginUser');
  openDropdown: any = {};
  // Form variables
  myFormFonte: FormGroup;
  filterForm: FormGroup;
  reactiveForm: UntypedFormGroup | any;
  
  // File upload variables
  tamanhoArquivos: string = '';
  quantidadeArquivos: string = '';
  commitMessage: string = '';
  selectedFonte: string = '';
  lDisabledButtonFonte: boolean = true;

  // Page
    page = 1;
    pageSize = 10;
    hasNext = false;
    hasPrevious = false;

  // Data variables
  data: any = [];
  dataAux: any = [];
  filteredData: any[] = [];
  nestedData: { [key: number]: any[] } = {};

  expandedRows: { [key: number]: boolean } = {};
  diffResult: any[] = [];
  sourceCod: any[] = [];

  // Options for select inputs
  statusOptions: any[] = [
    { label: 'Reservados', value: 'reservados' },
    { label: 'Todos', value: 'todos' },
    { label: 'Disponíveis', value: 'disponiveis' }
  ];
  developerOptions: any[] = [{ label: 'Todos', value: 'todos' }];

  // Table columns
  columns: PoTableColumn[] = [
    { property: 'id', label: 'ID', visible: false },
    { property: 'fonte', label: 'Nome', visible: false },
    { property: 'data_ini', label: 'Data Reserva' },
    { property: 'hora', label: 'Hora ' },
    { property: 'dev', label: 'Desenvolvedor' },
    { property: 'dias', label: 'Dias' },
    { property: 'data_fim', label: 'Devolução' },
    { property: 'source_ori', label: 'sourceOri', visible: false },
    { property: 'source_dev', label: 'sourceDev', visible: false }
  ];

  // Table actions
  actions: PoTableAction[] = [
    { action: (row: any) => this.viewFonte([row.source_dev], [row.source_ori] , [row.data_fim]), label: 'Visualizar', icon: 'po-icon po-icon-eye' },
    { action: (row: any) => this.downloadService.downloadFile([row.fonte], [row.source_dev]), label: 'Download', icon: 'po-icon po-icon-download' },
    { action: (row: any) => this.openModalDelete([row.id]), label: 'Excluir', icon: 'po-icon po-icon-delete', visible: this.isAdmin() , type: 'danger' }
  ];


  isAdmin(): boolean {
    const groupAdmin = sessionStorage.getItem('groupAdmin');
    return groupAdmin === null ? true : groupAdmin === 'true';
}

  // Modal actions
  confirmUpload: PoModalAction = {
    action: () => this.submitFonte(),
    label: 'Confirmar'
  };
  confirmDelete: PoModalAction = {
    action: () => this.deletaFonte(),
    label: 'Confirmar'
  };

  idDelete : number = 0 // Id delete
  

  
  close: PoModalAction = {
    action: () => this.closeModal(),
    label: 'Cancelar',
    danger: true
  };



  customLiterals: PoUploadLiterals = {
    sentWithSuccess: 'Upload concluído com sucesso.',
    selectFiles: 'Carregar Arquivos'
  };

  modalSize = 'xl';
  search2 = ''
  constructor(
    private fb: FormBuilder,
    private service: ReservService,
    public downloadService: DownloadService,
    private uploadService: UploadService,
    private codeDiffService: CodeDiffService,
    private fonteService: FonteService,
    private poNotification: PoNotificationService,
    private route: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.filterForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      status: ['reservados'],
      developer: ['todos']
    });

    this.myFormFonte = this.fb.group({
      fonte: ['', [Validators.required]]
    });

    this.reactiveForm = this.fb.group({
      search: [''],

  });

  }

  ngOnInit(): void {
    sessionStorage.setItem('reloadOk'   , 'no-reload');
    this.loadTableData();

  }

  loadTableData() {
    this.service.listReserv(this.page, this.pageSize).subscribe({
      next: (result: any) => {
        const filteredData = result.data.filter((item: any) => !item.data_fim);
        this.dataAux = result.data;
        this.data = filteredData;
        this.hasNext = result.hasNext;
        this.hasPrevious = this.page > 1;
        this.filteredData = [...this.data];
        this.populateDeveloperOptions();
        this.cdr.detectChanges(); // Forçar a detecção de mudanças
      }
    });
  }

  loadNextPage() {
    if (this.hasNext) {
        this.page++;
        this.loadTableData();
    }
}

loadPreviousPage() {
    if (this.page > 1) {
        this.page--;
        this.loadTableData();
    }
}

  restartTable() {
    sessionStorage.setItem('reloadOk'   , 'reload');
    window.location.reload();  }

getRowClass(rowItem: any): any {
  const classes = {
    'red-background': !rowItem.data_fim || rowItem.data_fim === null,
    'green-background': rowItem.data_fim && rowItem.data_fim !== null && rowItem.data_fim !== ''
  };
  return classes;
}

    
  populateDeveloperOptions(): void {
    const developers = Array.from(new Set(this.data.map((item: { dev: any; }) => item.dev)));
    this.developerOptions = [{ label: 'Todos', value: 'todos' }, ...developers.map(dev => ({ label: dev, value: dev }))];
  }

  formatDateString(dateString: string): string {
    if (!dateString) return '';
    return `${dateString.substring(0, 2)}/${dateString.substring(2, 4)}/${dateString.substring(4, 8)}`;
  }

  onFilter(): void {
    const { startDate, endDate, status, developer } = this.filterForm.value;
    const formattedStartDate = this.formatDateString(startDate);
    const formattedEndDate = this.formatDateString(endDate);

    this.filteredData = this.dataAux.filter((item: { data_ini: any; data_fim: any; dev: any; }) => {
      const formattedItemDate = item.data_ini;

      const matchesDate = (!startDate || formattedItemDate >= formattedStartDate) && (!endDate || formattedItemDate <= formattedEndDate);
      const matchesStatus = status === 'todos' || (status === 'reservados' && !item.data_fim) || (status === 'disponiveis' && item.data_fim);
      const matchesDeveloper = developer === 'todos' || item.dev === developer;

      return matchesDate && matchesStatus && matchesDeveloper;
    });
  }

  onSearch(): void {
    this.filteredData = this.dataAux.filter((item: { data_ini: any; data_fim: any; dev: any; fonte: string }) => {
      const valueSearch =  this.reactiveForm.get('search').value.toLowerCase()
      const matchesDeveloper =  item.dev.toLowerCase().includes(valueSearch) ;
      const matchesSearchSource = item.fonte.toLowerCase().includes(valueSearch);
      const matchesSearchData = item.data_ini.includes(valueSearch);
      return matchesSearchSource ||  matchesDeveloper || matchesSearchData
    });
  }


  toggleExpand(rowItem: any): void {
    const rowId = rowItem.id;
    if (!this.expandedRows[rowId]) {
      this.expandedRows[rowId] = true;
      if (!this.nestedData[rowId]) {
        this.loadNestedData(rowId, rowItem.fonte);
      }
    } else {
      this.expandedRows[rowId] = !this.expandedRows[rowId];
    }
  }
  
  loadNestedData(rowId: number, rowPrw: string): void {
    this.service.listReservPrw(rowId, rowPrw).subscribe({
      next: (result: any[]) => {
        this.nestedData[rowId] = result;
      },
    });
  }
  
  openModalUpload(fonte: string, dev: string): void {
    const user: any = sessionStorage.getItem('loginUser');
    if (user === dev) {
      this.selectedFonte = fonte;
      this.modalUpload.open();
    } else {
      this.poNotification.information(`Apenas o usuário ${dev} pode efetuar o upload.`);
    }
  }

  openModalDelete(id: any){
    this.idDelete = id
    this.modalDelete.open();
        
  }
  uploadArquivo(event: any): void {
    if (this.myFormFonte.value.fonte[0].name === this.selectedFonte) {
      if (this.myFormFonte.value.fonte[0].extension !== '.zip') {
        this.validFonts();
      } else {
        this.validFontZIP(event);
      }
    } else {
      this.poNotification.information(`Apenas o fonte ${this.selectedFonte} pode ser submetido.`);
    }
  }

  validFonts(): void {
    let quantidade = 0;
    let tamanhoTotal = 0;

    for (const fonte of this.myFormFonte.value.fonte) {
      quantidade++;
      tamanhoTotal += fonte.size;
    }

    this.tamanhoArquivos = `${(tamanhoTotal / (1024 * 1024)).toFixed(2).toString()} MB`;
    this.quantidadeArquivos = `${quantidade.toString()} arquivos`;
    this.lDisabledButtonFonte = false;
  }

  validFontZIP(event: any): void {
    const arquivo: File = event?.file?.rawFile;
    const leitor = new FileReader();
    const tamanhoArquivo = arquivo.size;

    leitor.onload = () => {
      const arrayBuffer = leitor.result as ArrayBuffer;
      const zip = new JSZip();
      zip.loadAsync(arrayBuffer).then((conteudoZip: any) => {
        let quantidadeArquivosDesejados = 0;
        const nomesArquivosEncontrados = new Set<string>();

        conteudoZip.forEach((nome: string, entrada: any) => {
          if (!entrada.dir) {
            const nomeArquivoLowerCase = nome.toLowerCase();
            if ((nomeArquivoLowerCase.endsWith('.prw') || nomeArquivoLowerCase.endsWith('.tlpp') || nomeArquivoLowerCase.endsWith('.prx')) &&
              !nomesArquivosEncontrados.has(nomeArquivoLowerCase)) {
              quantidadeArquivosDesejados++;
              nomesArquivosEncontrados.add(nomeArquivoLowerCase);
            }
          }
        });

        this.quantidadeArquivos = `${quantidadeArquivosDesejados.toString()} arquivos`;
        this.tamanhoArquivos = `${(tamanhoArquivo / (1024 * 1024)).toFixed(2).toString()} MB`;
        this.lDisabledButtonFonte = false;
      });
    };

    leitor.readAsArrayBuffer(arquivo);
  }

  closeModal(): void {
    this.tamanhoArquivos = '';
    this.quantidadeArquivos = '';
    this.commitMessage = '';
    this.modalUpload.close();
    this.modalDelete.close();
  }

  viewFonte(source: any, sourceOld: any, dataFim: any): void {
    
    if(dataFim){
      this.sourceCod = this.codeDiffService.compareCodeVersions(source, source);
      this.diffResult = this.codeDiffService.compareCodeVersions(sourceOld, source);
    } else{
      this.sourceCod = this.codeDiffService.compareCodeVersions(sourceOld, sourceOld);
      this.diffResult = this.codeDiffService.compareCodeVersions(sourceOld, sourceOld);

    }
    this.poModal.open();
  }



  async submitFonte(): Promise<void> {
    for (const control of Object.keys(this.myFormFonte.controls)) {
      this.myFormFonte.controls[control].markAsDirty();
      this.myFormFonte.controls[control].markAsTouched();
    }

    if (this.myFormFonte.valid) {
      const data: any = { uuid: uuidv4(), files: [] };
      try {
        const dataT = await this.uploadService.processUploadSource(this.myFormFonte , [] , true);
        data.files.push(dataT);

        this.fonteService.postFonteDev(data, this.commitMessage).subscribe({
          next: (res: any) => {
            this.tamanhoArquivos = '';
            this.quantidadeArquivos = '';
            this.commitMessage = '';
            this.poNotification.success('Código Fonte enviado com sucesso!');
            this.closeModal()
                   setTimeout(() => {
          this.restartTable();
        }, 3); // Adiciona um pequeno atraso
      

          },
          error: (error) => {
            console.log(error);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  }


  deletaFonte(){
    this.closeModal()
    this.service.delete(this.idDelete).subscribe((value) => {
        if (value) {
            this.poNotification.success(`Reserva deletada com sucesso!`);
            setTimeout(() => {
               this.restartTable();
            }, 300);
        } else {
            this.poNotification.error(
                `Ocorreu um erro ao tentar excluir a reserva`
            );
        }
    });
}

toggleDropdown(item: any) {
  if (this.openDropdown[item.id]) {
    delete this.openDropdown[item.id];
  } else {
    this.openDropdown[item.id] = true;
  }
}

isDropdownOpen(item: any) {
  return !!this.openDropdown[item.id];
}

viewItem(item: any) {
  // Lógica para visualizar o item
  console.log('Visualizar item', item);
}

deleteItem(item: any) {
  // Lógica para excluir o item
  console.log('Excluir item', item);
}

  closeDropdown(item: any) {
    delete this.openDropdown[item.id];
  }
}
