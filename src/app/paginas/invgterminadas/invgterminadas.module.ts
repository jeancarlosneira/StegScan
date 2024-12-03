import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvgterminadasPageRoutingModule } from './invgterminadas-routing.module';

import { InvgterminadasPage } from './invgterminadas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvgterminadasPageRoutingModule
  ],
  declarations: [InvgterminadasPage]
})
export class InvgterminadasPageModule {}
