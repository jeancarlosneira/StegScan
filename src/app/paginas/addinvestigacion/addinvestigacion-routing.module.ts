import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddinvestigacionPage } from './addinvestigacion.page';

const routes: Routes = [
  {
    path: '',
    component: AddinvestigacionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddinvestigacionPageRoutingModule {}
