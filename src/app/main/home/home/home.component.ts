import { Component, OnInit, ViewChild, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PoNotificationService, PoUploadComponent, PoUploadFile, PoUploadLiterals } from '@po-ui/ng-components';
import { DicionarioService } from '../../dictionary/services/dicionario.service';
import { v4 } from 'uuid';
import { FonteService } from '../../fonte/services/fonte.service';
import * as JSZip from 'jszip';
import * as moment from 'moment';
import 'moment-timezone';
import { UploadService } from 'src/app/services/upload/upload.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  @ViewChildren('fileInput') fileInputs!: QueryList<ElementRef>;
  private uploadRefs = new Map<string, PoUploadComponent>();

  nameButtonAnalise = 'Gerar Análise';
  lbuttonAnalise = true;
  uploads: any[] = [
    { id: 1, name: '', files: [], quantidadeArquivos: '', tamanhoArquivos: '' },
    { id: 2, name: '', files: [], quantidadeArquivos: '', tamanhoArquivos: '' },
  ];
  uploadNames: string[] = [];

  @ViewChild('dict1', { static: true })
  set dict1Ref(component: PoUploadComponent) {
    if (component) {
      this.uploadRefs.set('dict1', component);
    }
  }

  @ViewChild('dict2', { static: true })
  set dict2Ref(component: PoUploadComponent) {
    if (component) {
      this.uploadRefs.set('dict2', component);
    }
  }

  get areAllNamesFilled() {
    return this.uploads.every(upload => upload.name && upload.name.trim().length > 0);
  }

  dict1!: PoUploadComponent;
  dict2!: PoUploadComponent;

  @ViewChild('fonte', { static: true })
  fonte!: PoUploadComponent;

  file1: File | null = null;
  file2: File | null = null;

  dataRegs: any;
  myFormDicionario: FormGroup = this.fb.group({
    dict1: ['', [Validators.required]],
    dict2: ['', [Validators.required]],
  });

  myFormFonte: FormGroup = this.fb.group({
    fonte: ['', [Validators.required]],
  });

  tamanhoArquivos: string = '';
  quantidadeArquivos: string = '';
  commitMessage: string = '';

  tamArqDic: string = '';
  qntArqDic: string = '';

  lDisabledButtonFonte: boolean = true;

  customLiterals: PoUploadLiterals = {
    sentWithSuccess: 'Upload concluído com sucesso.',
    selectFiles: 'Carregar Arquivos',
  };

  uuid?: string;
  arquivos: PoUploadFile[] = [];
  isHideLoading?: boolean = true;
  isLoadingFonte?: boolean = true;
  percentDone: number = 0;
  dict1Desabled: boolean = false;
  dict2Desabled: boolean = true;
  showEnviar: boolean = true;
  showAnalisar: boolean = false;
  upload: any;

  constructor(
    private fb: FormBuilder,
    private dicionarioService: DicionarioService,
    private uploadService: UploadService,
    private poNotification: PoNotificationService,
    private fonteService: FonteService
  ) {
    this.atualizaForm();
  }

  ngOnInit(): void {
    this.myFormDicionario = this.fb.group({
      uploads: this.fb.array(this.uploads.map(upload => this.fb.control(upload.name))),
    });
  }

  enviarArquivos() {
    this.nameButtonAnalise = 'Gerando Análise..';
    this.lbuttonAnalise = true;
    this.poNotification.success('Dicionários enviados para análise.');
    const id = moment().tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss');

    const formData = new FormData();
    let uploadsData: { name: any; index: number; }[] = [];

    const processUpload = async (upload: any, index: number) => {
      if (upload.files && upload.files.length > 0) {
        for (let file of upload.files) {
          if (file.type === 'application/zip') {
            const zip = new JSZip();
            const zipContent = await zip.loadAsync(file);
            for (let filename in zipContent.files) {
              if (!zipContent.files[filename].dir) {
                const extractedFile = await zipContent.files[filename].async('blob');
                formData.append(`files${index + 1}`, extractedFile, filename);
              }
            }
          } else {
            formData.append(`files${index + 1}`, file, file.name);
          }
        }
        uploadsData.push({
          name: upload.name || `dict${index + 1}`,
          index: index + 1,
        });
      }
    };

    (async () => {
      for (let i = 0; i < this.uploads.length; i++) {
        await processUpload(this.uploads[i], i);
      }

      formData.append('uploadsData', JSON.stringify(uploadsData));
      formData.append('uploadsCount', this.uploads.length.toString());
      formData.append('analysisId', id);

      this.dicionarioService.createAnalysis(id).subscribe({
        next: (response) => {
          console.log('Upload bem-sucedido', response);
        },
      });

      if (uploadsData.length > 0) {
        this.dicionarioService.geraAnalie(formData).subscribe({
          next: (response) => {
            console.log('Upload bem-sucedido', response);
            this.nameButtonAnalise = 'Gerar Análise';
            this.poNotification.success('Análise finalizada com sucesso.');
          },
          error: (error) => {
            console.error('Erro no upload', error);
            this.nameButtonAnalise = 'Gerar Análise';
          },
        });
      } else {
        this.lbuttonAnalise = false;
        this.nameButtonAnalise = 'Gerar Análise';
      }
    })();
  }

  addNewUpload() {
    const nextId = this.uploads.length + 1;
    this.uploads.push({ id: nextId, name: '', files: [], quantidadeArquivos: '', tamanhoArquivos: '' });
  }

  selectFiles(index: number) {
    const fileInput: HTMLElement = this.fileInputs.toArray()[index].nativeElement;
    fileInput.click();
  }

  onFileSelected(event: Event, upload: any) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (this.uploads.length > 1) {
      this.lbuttonAnalise = false;
    }
    if (files) {
      upload.files = Array.from(files);
      const totalSize = Array.from(files).reduce((acc, file) => acc + file.size, 0);
      upload.tamanhoArquivos = `${(totalSize / (1024 * 1024)).toFixed(2).toString()} MB`;
      upload.quantidadeArquivos = `${files.length.toString()} arquivos`;
    }
  }

  atualizaForm() {
    const controls = this.uploads.reduce((acc, curr) => {
      acc[curr.name] = ['', Validators.required];
      return acc;
    }, {});

    this.myFormDicionario = this.fb.group(controls);
  }

  uploadArquivo(event: any) {
    if (this.myFormFonte.value.fonte[0].extension !== '.zip') {
      this.validFonts();
    } else {
      this.validFontZIP(event);
    }
  }

  validFonts() {
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

  validFontZIP(event: any) {
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

  async analisarFonte() {
    for (const control of Object.keys(this.myFormFonte.controls)) {
      this.myFormFonte.controls[control].markAsDirty();
      this.myFormFonte.controls[control].markAsTouched();
    }

    if (this.myFormFonte.valid) {
      this.isLoadingFonte = false;
      this.percentDone = 0;
      const data: any = {};
      data.uuid = v4();
      data.files = [];

      try {
        const fontesPermitidas = await this.uploadService.getFontesPermitidas();
        const dataT = await this.uploadService.processUploadSource(this.myFormFonte, fontesPermitidas, false);
        if (dataT.length === 0) {
          this.poNotification.warning('Nenhum dos arquivos enviados está reservado para o seu usuário. Por favor, verifique os arquivos e tente novamente.');
          this.isLoadingFonte = true;
          return;
        }

        data.files.push(...dataT);

        this.fonteService.postFonte(data, this.commitMessage).subscribe({
          next: (res: any) => {
            this.isLoadingFonte = true;
            this.tamanhoArquivos = '';
            this.quantidadeArquivos = '';
            this.commitMessage = '';
            this.poNotification.success('Código Fonte enviado com sucesso!');
            this.lDisabledButtonFonte = true;
          },
          error: (error) => {
            this.isLoadingFonte = true;
          },
        });
      } catch (error) {
        this.isLoadingFonte = true;
        console.log(error);
      }
    }
  }
}
