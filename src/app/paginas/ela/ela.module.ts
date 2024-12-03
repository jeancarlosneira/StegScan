import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ELAPageRoutingModule } from './ela-routing.module';

import { ELAPage } from './ela.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ELAPageRoutingModule,
  ],
  declarations: [ELAPage]
})
export class ELAPageModule {}
