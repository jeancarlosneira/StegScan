import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportemetaPage } from './reportemeta.page';

const routes: Routes = [
  {
    path: '',
    component: ReportemetaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportemetaPageRoutingModule {}
