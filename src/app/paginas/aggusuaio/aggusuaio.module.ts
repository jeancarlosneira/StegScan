import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AggusuaioPageRoutingModule } from './aggusuaio-routing.module';

import { AggusuaioPage } from './aggusuaio.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AggusuaioPageRoutingModule
  ],
  declarations: [AggusuaioPage]
})
export class AggusuaioPageModule {}
