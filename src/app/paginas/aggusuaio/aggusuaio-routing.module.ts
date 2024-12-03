import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AggusuaioPage } from './aggusuaio.page';

const routes: Routes = [
  {
    path: '',
    component: AggusuaioPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AggusuaioPageRoutingModule {}
