import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReginvPage } from './reginv.page';

const routes: Routes = [
  {
    path: '',
    component: ReginvPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReginvPageRoutingModule {}
