import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AnalysisListComponent } from "./analysis-list/analysis-list.component";
import { AnalysisCreateComponent } from "./analysis-create/analysis-create.component";

const routes: Routes = [
  { path: "", component: AnalysisListComponent },
  { path: "create", component: AnalysisCreateComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AnalysisRoutingModule {}
