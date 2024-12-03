import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReporteestegaPageRoutingModule } from './reporteestega-routing.module';

import { ReporteestegaPage } from './reporteestega.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReporteestegaPageRoutingModule
  ],
  declarations: [ReporteestegaPage]
})
export class ReporteestegaPageModule {}
