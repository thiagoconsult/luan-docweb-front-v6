import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import {
  PoBreadcrumb,
  PoNotificationService,
  PoPageAction,
  PoTableColumn,
} from "@po-ui/ng-components";
import { DicionarioService } from "../../dictionary/services/dicionario.service";
import { CategoryService } from "../../category/services/category.service";
import { FonteService } from "../../fonte/services/fonte.service";
import { AnalysisService } from "../service/analysis.service";
import * as moment from "moment";
import { Router } from "@angular/router";
import { FormBuilder, UntypedFormGroup } from "@angular/forms";

@Component({
  selector: "app-analysis-create",
  templateUrl: "./analysis-create.component.html",
  styleUrls: ["./analysis-create.component.css"],
})
export class AnalysisCreateComponent implements OnInit {
  constructor(
    private router: Router,
    private dicionarioService: DicionarioService,
    private service: CategoryService,
    private fonteService: FonteService,
    private analysisService: AnalysisService,
    private poNotification: PoNotificationService,
    private fb: FormBuilder
  ) {
    this.reactiveForm = this.fb.group({
      search: [""],
      searchSource: [""],
    });
  }

  public readonly breadcrumb: PoBreadcrumb = {
    items: [
      { label: "Análise Cruzada", link: "/main/analysis" },
      { label: "Nova Análise" },
    ],
  };

  reactiveForm: UntypedFormGroup | any;
  itemsSX2 = [];
  fontes = [];
  search = "";
  categoryList = [];
  columnsDict: PoTableColumn[] = [
    { property: "id_analysis", label: "ID Análise de Dicionário" },
  ];
  isTable1Disabled = false;
  isTable2Disabled = false;
  columns: any[] = [
    { property: "category", label: "Categorias" },
    { property: "content", label: "Conteudo", visible: false },
  ];

  pageActions: PoPageAction[] = [
    {
      label: "Processar",
      action: this.processAnalysis.bind(this),
      disabled: this.disableProcess.bind(this),
    },
  ];

  ngOnInit(): void {
    this.loadDicionario();
    this.listCategorys();
    this.loadFonte();
  }
  disableProcess() {
    const selectedRowDic = this.itemsSX2.filter(
      (item: any) => item.$selected
    ).length;
    const selectedRowsFontes = this.fontes.filter(
      (item: any) => item.$selected
    ).length;
    const selectedRowsCategory = this.categoryList.filter(
      (item: any) => item.$selected
    ).length;

    return !(
      selectedRowDic > 0 &&
      (selectedRowsFontes > 0 || selectedRowsCategory > 0)
    );
  }

  onTableBlock() {
    //
    if (this.fontes.filter((item: any) => item.$selected).length > 0) {
      this.isTable1Disabled = true;
    } else {
      this.isTable1Disabled = false;
    }

    if (this.categoryList.filter((item: any) => item.$selected).length > 0) {
      this.isTable2Disabled = true;
    } else {
      this.isTable2Disabled = false;
    }
  }

  processAnalysis() {
    const selectedRowDic = this.itemsSX2.filter((item: any) => item.$selected);
    const selectedRowsFontes = this.fontes.filter(
      (item: any) => item.$selected
    );
    const selectedRowsCategory = this.categoryList.filter(
      (item: any) => item.$selected
    );

    const dictionaryId: any = [];
    const fontes: any = [];
    const categorys: any = [];

    const id = new Date().toISOString(); //moment().tz('America/Sao_Paulo').format('YYYY-MM-DDTHH:mm:ss');

    for (const row of selectedRowDic) {
      dictionaryId.push(row["id_analysis"]);
    }

    if (selectedRowsFontes.length > 0) {
      for (const row of selectedRowsFontes) {
        fontes.push(row["fonte"]);
      }
    } else {
      for (const row of selectedRowsCategory) {
        categorys.push(row["category"]);
      }
    }

    const requestData = {
      id: dictionaryId[0], // Assumindo que você usa o primeiro id_analysis
      fontes: fontes,
      categorys: categorys,
      analysisId: `AC${id}`,
    };

    this.analysisService.processAnalysis(requestData).subscribe(
      (response) => {
        console.log("API response:", response);
        // Aqui você pode fazer algo com a resposta da API, como atualizar a interface do usuário
        this.router.navigateByUrl("/main/analysis");
        this.poNotification.success(`Análise AC${id} processada com sucesso!`);
      },
      (error) => {
        console.error("API error:", error);
        // Aqui você pode lidar com erros, como mostrar uma mensagem de erro para o usuário
      }
    );
  }

  loadDicionario() {
    this.dicionarioService.getHist(1, 50).subscribe({
      next: (result: any) => {
        this.itemsSX2 = result.data;
      },
      error: (error) => {},
    });
  }

  onSearchSource() {
    if (this.reactiveForm.get("searchSource").value) {
      this.fontes = this.fontes.filter((item: { fonte: any }) => {
        const valueSearch = this.reactiveForm
          .get("searchSource")
          .value.toLowerCase();
        const matchesSearchSource = item.fonte
          .toLowerCase()
          .includes(valueSearch);
        return matchesSearchSource;
      });
    } else {
      this.loadFonte();
    }
  }

  onSearchCategory() {
    if (this.reactiveForm.get("search").value) {
      this.categoryList = this.categoryList.filter(
        (item: { category: any }) => {
          const valueSearch = this.reactiveForm
            .get("search")
            .value.toLowerCase();
          const matchesSearchSource = item.category
            .toLowerCase()
            .includes(valueSearch);
          return matchesSearchSource;
        }
      );
    } else {
      this.listCategorys();
    }
  }

  listCategorys() {
    this.service.listCategory().subscribe({
      next: (result: any) => {
        this.categoryList = result.items;
      },
      error: (error) => {},
    });
  }

  loadFonte() {
    console.log(this.search);
    this.fonteService.getHist("", this.search).subscribe({
      next: (data) => {
        this.fontes = data.items; // Supondo que a API retorna diretamente a lista
      },
      error: (error) => console.error("Erro ao carregar fontes:", error),
    });
  }
}
