import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Estegoanalisis2Page } from './estegoanalisis2.page';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  {
    path: '',
    component: Estegoanalisis2Page
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class Estegoanalisis2PageRoutingModule {}
