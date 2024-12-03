import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SubirImgPageRoutingModule } from './subir-img-routing.module';

import { SubirImgPage } from './subir-img.page';
import { ComponentesModule } from 'src/app/componentes/componentes.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SubirImgPageRoutingModule,
    ComponentesModule
  ],
  declarations: [SubirImgPage]
})
export class SubirImgPageModule {}
