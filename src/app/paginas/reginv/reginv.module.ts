import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ReginvPageRoutingModule } from './reginv-routing.module';

import { ReginvPage } from './reginv.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReginvPageRoutingModule
  ],
  declarations: [ReginvPage]
})
export class ReginvPageModule {}
