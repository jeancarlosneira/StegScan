import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CompElaPageRoutingModule } from './comp-ela-routing.module';

import { CompElaPage } from './comp-ela.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CompElaPageRoutingModule
  ],
  declarations: [CompElaPage]
})
export class CompElaPageModule {}
