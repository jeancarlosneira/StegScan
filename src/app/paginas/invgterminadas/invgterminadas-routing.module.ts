import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InvgterminadasPage } from './invgterminadas.page';

const routes: Routes = [
  {
    path: '',
    component: InvgterminadasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InvgterminadasPageRoutingModule {}
