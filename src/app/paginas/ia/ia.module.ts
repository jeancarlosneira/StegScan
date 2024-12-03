import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IaPageRoutingModule } from './ia-routing.module';

import { IaPage } from './ia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IaPageRoutingModule
  ],
  declarations: [IaPage]
})
export class IaPageModule {}
