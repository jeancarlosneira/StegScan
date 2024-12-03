import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvestigacionesPageRoutingModule } from './investigaciones-routing.module';

import { InvestigacionesPage } from './investigaciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvestigacionesPageRoutingModule
  ],
  declarations: [InvestigacionesPage]
})
export class InvestigacionesPageModule {}
