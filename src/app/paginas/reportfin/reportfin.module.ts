import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportfinPageRoutingModule } from './reportfin-routing.module';

import { ReportfinPage } from './reportfin.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportfinPageRoutingModule
  ],
  declarations: [ReportfinPage]
})
export class ReportfinPageModule {}
