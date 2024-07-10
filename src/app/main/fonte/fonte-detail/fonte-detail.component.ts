import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FonteService } from '../services/fonte.service';
import { PoBreadcrumbItem } from '@po-ui/ng-components';

@Component({
    selector: 'app-fonte-detail',
    templateUrl: './fonte-detail.component.html',
    styleUrls: ['./fonte-detail.component.css'],
})
export class FonteDetailComponent implements OnInit, AfterViewInit {
    uuid: string = '';
    id: number = 0;

    title = '';
    category = '';
    item: any = null;

    poBreadcrumb : any
    poBreadcrumbItem: PoBreadcrumbItem[] = [];
    poDialog: any;
    

    constructor(
        private cdref: ChangeDetectorRef,
        private route: ActivatedRoute,
        private fonteService: FonteService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.route.params.subscribe((params) => {
            this.uuid = params['uuid'];
            this.id = params['id'];
        });
        this.loadDetail();
    }

    ngAfterViewInit(): void {
        this.cdref.detectChanges();
    }

    private loadDetail() {
        this.fonteService.getDetail(this.uuid, this.id).subscribe({
            next: (result: any) => {
                if (result.items && result.items.length > 0) {
                    // Processar o item para remover duplicatas
                    let item = result.items[0];
    
                    // Remover tabelas duplicadas
                    item.tables = this.removeDuplicateTables(item.tables);
    
                    // Remover campos duplicados em cada tabela
                    item.tables.forEach((table: any) => {
                        table.fields = this.removeDuplicateFields(table.fields);
                    });
    
                    // Atribuir o item processado à variável this.item
                    this.item = item;
                    this.category = this.item.category;
                    this.title = `${this.item.name} - ${this.item.category}`;
                    this.cdref.detectChanges();
                    this.updateBreadcrumb();
                }
            },
            error: (error: any) => {
                // Lidar com o erro
                console.error('Erro ao carregar os detalhes:', error);
            },
        });
    }
    
    // Função para remover tabelas duplicadas
    private removeDuplicateTables(tables: any[]): any[] {
        const uniqueTables = new Map();
        tables.forEach(table => {
            if (!uniqueTables.has(table.name)) {
                uniqueTables.set(table.name, table);
            }
        });
        return Array.from(uniqueTables.values());
    }
    
    // Função para remover campos duplicados em uma tabela
    private removeDuplicateFields(fields: any[]): any[] {
        return Array.from(new Set(fields));
    }
    



    updateBreadcrumb() {
        this.poBreadcrumb = 
        {
            items: [{ label: 'Repositório', link: '/main/fonte/info' }, { label:  this.category,}]
          };      
    }

    onBack() {
        window.history.back();
    }
}
