import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { Metadatos2Page } from './metadatos2.page';

const routes: Routes = [
  {
    path: '',
    component: Metadatos2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Metadatos2PageRoutingModule {}
