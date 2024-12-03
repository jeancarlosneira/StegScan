import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportfinPage } from './reportfin.page';

const routes: Routes = [
  {
    path: '',
    component: ReportfinPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportfinPageRoutingModule {}
