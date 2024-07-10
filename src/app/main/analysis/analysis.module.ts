import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AnalysisRoutingModule } from "./analysis-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { FormsModule } from "@angular/forms";
import { AnalysisListComponent } from "./analysis-list/analysis-list.component";
import { AnalysisCreateComponent } from "./analysis-create/analysis-create.component";

@NgModule({
  declarations: [AnalysisListComponent, AnalysisCreateComponent],
  imports: [CommonModule, AnalysisRoutingModule, SharedModule, FormsModule],
})
export class AnalysisModule {}
