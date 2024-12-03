import { Component } from '@angular/core';
import { GeneralService } from './services/general.service';
import { LoadingController, NavController } from '@ionic/angular';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    public servG:GeneralService,
    private navCtrl: NavController,
    private loading:LoadingController,
  ) {}
  ngOnInit(){
    
  }
  async accion(page:string) {
    let l=await this.loading.create();
    l.present();
    if(page==='ela'){
      l.dismiss();
      this.navCtrl.navigateForward('/' + page);
    }else if(page==='metadatos'){
      l.dismiss();
      this.navCtrl.navigateForward('/' + page);
    }else if(page==='ia'){
      l.dismiss();
      this.navCtrl.navigateForward('/' + page);
    }else if(page==='subir-img'){
      l.dismiss();
      this.navCtrl.navigateForward('/' + page);
    }
  }

}
