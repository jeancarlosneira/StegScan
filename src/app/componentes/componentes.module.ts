import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuComponent } from './menu/menu.component';
import { IonicModule } from '@ionic/angular';
import { MenuadminComponent } from './menuadmin/menuadmin.component';

@NgModule({
  declarations: [MenuComponent,MenuadminComponent],
  exports: [MenuComponent,MenuadminComponent],
  imports: [
    CommonModule, IonicModule
  ]
})
export class ComponentesModule { }
