import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UsoappPage } from './usoapp.page';

const routes: Routes = [
  {
    path: '',
    component: UsoappPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsoappPageRoutingModule {}
