import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstegoanalisisPageRoutingModule } from './estegoanalisis-routing.module';

import { EstegoanalisisPage } from './estegoanalisis.page';


@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EstegoanalisisPageRoutingModule,
    
  ],
  declarations: [EstegoanalisisPage]
})
export class EstegoanalisisPageModule {}
