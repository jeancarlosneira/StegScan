import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvestigacionesPage } from './investigaciones.page';

const routes: Routes = [
  {
    path: '',
    component: InvestigacionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvestigacionesPageRoutingModule {}
