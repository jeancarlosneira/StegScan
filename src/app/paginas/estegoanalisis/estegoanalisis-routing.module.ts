import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstegoanalisisPage } from './estegoanalisis.page';

const routes: Routes = [
  {
    path: '',
    component: EstegoanalisisPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EstegoanalisisPageRoutingModule {}
