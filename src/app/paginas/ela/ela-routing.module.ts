import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ELAPage } from './ela.page';

const routes: Routes = [
  {
    path: '',
    component: ELAPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ELAPageRoutingModule {}
