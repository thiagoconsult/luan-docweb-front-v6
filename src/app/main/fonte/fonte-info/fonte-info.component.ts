import { Component, OnInit, ViewChild } from '@angular/core';
import {
    PoModalAction,
    PoModalComponent,
    PoNotificationService,
    PoTableAction,
    PoTableColumn,
} from '@po-ui/ng-components';
import {  Router } from '@angular/router';
import { FonteService } from '../services/fonte.service';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../category/services/category.service';
import { DownloadService } from 'src/app/services/download/download.service';

@Component({
    selector: 'app-fonte-info',
    templateUrl: './fonte-info.component.html',
    styleUrls: ['./fonte-info.component.css'],
})
export class FonteInfoComponent implements OnInit {
    @ViewChild('modalDocDelete') modalDocDelete?: PoModalComponent ;
    @ViewChild('modalFontDelete') modalFontDelete?: PoModalComponent ;
    @ViewChild('modalFontCategory') modalFontCategory?: PoModalComponent ;

    isAdmin: boolean = false;

    constructor(
        private fonteService: FonteService,
        private categoryService: CategoryService,
        public  downloadService: DownloadService,
        private router: Router,
        private poNotification: PoNotificationService,
        private fb: UntypedFormBuilder,

    ) { this.createReactiveForm(); }


    // Variaveis para o modal de exclusão de documentação.
    confirm: PoModalAction = {
        action: () => {
          this.onDelete();
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
    
    // Variaveis para o modal de exclusão de fonte.
    prw: string = ''
    confirmModalFont: PoModalAction = {
        action: () => {
          this.deletaFonte();
        },
        label: 'Confirmar',
        danger: true
    };

    // Variaveis para o modal para categorizar fonte.
    categories : any = [];
    showCustomInput = false;
    selectedCategory: string = '';
    customCategory = '';


    confirmModalCategory: PoModalAction = {
        action: () => {
          this.UpdateCategory();
        },
        label: 'Confirmar',
    };   

    // Variaveis da busca avançada
    search : string = ''
    reactiveForm: UntypedFormGroup | any;


    

    Object = Object;
    tableColumns: PoTableColumn[] = [{ label: 'Nome', property: 'name' }];
    tableActions: PoTableAction[] = [
        { label: 'Visualizar', action: this.onViewDetail.bind(this) },
    ];

    lDisabled: boolean = true;

    uuid!: string;
    isHideLoading: boolean = true;
    totalProgramsCount: any = 0;
    labelPainelDoc: any = ''

    items: any = {};



    ngOnInit(): void {
        this.isAdmin = sessionStorage.getItem('groupAdmin') === 'true';
        this.listCategory();
        this.fonteService.getFontes({}).subscribe({
            next: (data) => {
                // Verifica se data.items não está vazio
                if (data.items && data.items.length > 0) {
                    data.items.forEach((item: any) => {
                        if (!item.uuid || item.uuid.trim() === '') {
                            this.loadFonte('9811');
                        } else {
                            this.uuid = item.uuid
                            this.loadFonte(item.uuid);
                        }
                    });
                } else {
                    // Se data.items estiver vazio envio uuid aleatorio
                    this.loadFonte('9999');
                }
            },
            error: (error) => {
                console.error(error);
            },
        });
    }

    // 
    createReactiveForm() {
        this.reactiveForm = this.fb.group({
            search: ['', Validators.compose([  Validators.maxLength(100)])],

        });
      }

    loadFonte(uuid: string) {
        this.isHideLoading = false;

        this.fonteService.getFonte(uuid, this.search).subscribe({
            next: (result: any) => {
                this.items = this.groupBy(result.items, 'category');


                this.totalProgramsCount = Object.keys(this.items).reduce(
                    (total, category) => total + this.items[category].length,
                    0
                );
                this.isHideLoading = true;

                if (this.totalProgramsCount === 0) {
                    this.labelPainelDoc = `Não há dados a serem apresentados.`;
                    this.lDisabled = true;
                } else {
                    this.labelPainelDoc = `Programas (${this.totalProgramsCount})`;
                    this.lDisabled = false;
                }
            },
            error: (error) => {
                console.error('Error loading data:', error);
            }
        });
    }

    onViewDetail(item: any) {
        console.log( item.uuid, item.id)
        this.router.navigate(['main/fonte/detail', item.uuid, item.id]);
    }

    private groupBy(xs: any, key: any) {
        return xs.reduce(function (rv: any, x: any) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    }

    // Função para abrir o modal de exclusão de documentação.
    openModal(){
        this.modalDocDelete?.open()
    }
    // Função para abrir o modal de exclusão de fonte.
    openModalFont(prw: any) {
        this.prw = prw;
        this.modalFontDelete?.open();
    }
    // Função para abrir o modal de categorização.
    openModalCategory(prw: any) {

        this.prw = prw;
        this.selectedCategory = '';
        this.customCategory = '';
        this.modalFontCategory?.open();
    }
    // Função para fechar modal.
    closeModal() {
        this.modalDocDelete?.close();
        this.modalFontDelete?.close();
        this.modalFontCategory?.close();
    }


    listCategory() {
        this.categoryService.listCategory().subscribe({
            next: (result) => {
            this.categories = result.items;
            this.categories.push({ category: 'CADASTRAR NOVA CATEGORIA', content: 'CADASTRAR NOVA CATEGORIA' }); 
  
            },
            error: (error) => {},
        });
    }

    onCategoryChange(event: any) {

        this.selectedCategory = event; // Assumindo que o evento retorna um objeto com uma propriedade `value`
        this.showCustomInput = this.selectedCategory === 'CADASTRAR NOVA CATEGORIA';
    
    }

      UpdateCategory(){
        const category = this.customCategory.trim() !== '' ? this.customCategory : this.selectedCategory;
        const formData = {category: category , content: category}

        console.log(category)
        this.categoryService.saveCategory(formData).subscribe((value) => {
            console.log(value)
         });

        this.fonteService.updateCategory(this.prw, category).subscribe((value) => {
            console.log(value)
            this.poNotification.success(value.message);
            this.ngOnInit();
        });

         this.closeModal()
      }

    updateField(){

        this.search = this.reactiveForm.get('search').value;

        this.loadFonte(this.uuid)

    }

    reserv(prw: string ){
       
        this.fonteService.updateSourceReserv(prw).subscribe((value) => {
            if (value) {
                this.poNotification.success(`Fonte reservado com sucesso!`);
                setTimeout(() => {
                    this.ngOnInit();
                 }, 300);
            }
        });
    }

    downloadPrw(prw: string ){

    }

    deletaFonte(){
        this.closeModal()
        this.fonteService.deletePrw(this.prw).subscribe((value) => {
            if (value) {
                this.poNotification.success(`Fonte deletado com sucesso!`);

                setTimeout(() => {
                   this.ngOnInit();
                }, 300);
            } else {
                this.poNotification.error(
                    `Ocorreu um erro ao tentar excluir os registros`
                );
            }
        });
    }

    onDelete() {
        this.closeModal()
        this.fonteService.deleteFonte(this.uuid).subscribe((value) => {
            if (value) {
                this.poNotification.success(`Registros deletados com sucesso!`);
                setTimeout(() => {
                    this.ngOnInit();
                 }, 300);
            } else {
                this.poNotification.error(
                    `Ocorreu um erro ao tentar excluir os registros`
                );


            }
        });
    }

}
