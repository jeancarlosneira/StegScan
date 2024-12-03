import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-menuadmin',
  templateUrl: './menuadmin.component.html',
  styleUrls: ['./menuadmin.component.scss'],
})
export class MenuadminComponent  implements OnInit {

 
  listaMenu: any[] = [];
  Nombreusuario: string
  constructor(
    private navCtrl: NavController,
    private loading: LoadingController,
    public servG: GeneralService,
    public serU: UsuariosService,
  ) { }

  ngOnInit() {
    
  }
  async accion(page: string) {
    let l = await this.loading.create();
    l.present();
    if (page === 'ela') {
      l.dismiss();
      this.navCtrl.navigateForward('/' + page);
    } else if (page === 'metadatos2') {
      l.dismiss();
      this.navCtrl.navigateForward('/' + page);
    } else if (page === 'ia') {
      l.dismiss();
      this.navCtrl.navigateForward('/' + page);
    } else if (page === 'subir-img') {
      l.dismiss();
      this.navCtrl.navigateForward('/' + page);
    }else if (page === 'estadisticas') {
      l.dismiss();
      this.navCtrl.navigateForward('/' + page);
    }else if (page === 'aggusuaio') {
      l.dismiss();
      this.navCtrl.navigateForward('/' + page);
    }
  }

  
  cerrarsesion(){
this.serU.logout()
  
}

}
