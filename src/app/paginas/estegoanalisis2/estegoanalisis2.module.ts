import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { Estegoanalisis2PageRoutingModule } from './estegoanalisis2-routing.module';

import { Estegoanalisis2Page } from './estegoanalisis2.page';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    Estegoanalisis2PageRoutingModule,
    HttpClientModule
  ],
  declarations: [Estegoanalisis2Page]
})
export class Estegoanalisis2PageModule {}
