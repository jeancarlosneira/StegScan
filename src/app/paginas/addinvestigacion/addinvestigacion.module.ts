import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddinvestigacionPageRoutingModule } from './addinvestigacion-routing.module';

import { AddinvestigacionPage } from './addinvestigacion.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddinvestigacionPageRoutingModule
  ],
  declarations: [AddinvestigacionPage]
})
export class AddinvestigacionPageModule {}
