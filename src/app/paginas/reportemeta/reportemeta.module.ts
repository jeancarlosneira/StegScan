import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReportemetaPageRoutingModule } from './reportemeta-routing.module';

import { ReportemetaPage } from './reportemeta.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReportemetaPageRoutingModule
  ],
  declarations: [ReportemetaPage]
})
export class ReportemetaPageModule {}
