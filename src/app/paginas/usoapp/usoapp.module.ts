import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsoappPageRoutingModule } from './usoapp-routing.module';

import { UsoappPage } from './usoapp.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UsoappPageRoutingModule
  ],
  declarations: [UsoappPage]
})
export class UsoappPageModule {}
