import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Metadatos2PageRoutingModule } from './metadatos2-routing.module';

import { Metadatos2Page } from './metadatos2.page';
import { ComponentesModule } from 'src/app/componentes/componentes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Metadatos2PageRoutingModule,
    ComponentesModule
  ],
  declarations: [Metadatos2Page]
})
export class Metadatos2PageModule {}
