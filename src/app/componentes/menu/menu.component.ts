import { Component, OnInit } from '@angular/core';
import { LoadingController, NavController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit {

  listaMenu: any[] = [];
  public idusuario: number;
  public Nombreusuario: string = 'hola';
  public name_invg: string;
  new: any;
  constructor(
    private navCtrl: NavController,
    private loading: LoadingController,
    public servG: GeneralService,
    public serU: UsuariosService,
  ) { }

  async ngOnInit() {
    await this.retornarusu();
    await this.retornarnameinvg();
    await this.CargarMenu();
  }
  retornarusu() {
    const userSession = JSON.parse(localStorage.getItem('idusu'));
    this.idusuario = userSession;
    console.log('id usuario: ' + this.idusuario);
    this.serU.retornarusuario(this.idusuario)
    this.new = this.serU.retornarusuario(this.idusuario)
    console.log('prueba ' + this.serU.retornarusuario(this.idusuario))
    console.log(this.new)
  }
  retornarnameinvg() {
    const id = localStorage.getItem('name_invg');
    this.name_invg = id;
    console.log('nombre invg:', id);
  }
  async accion(page: string) {
    let l = await this.loading.create();
    l.present();
    if (page === 'estegoanalisis') {
      l.dismiss();
      this.navCtrl.navigateForward('/' + page);
    } else if (page === 'ela') {
      l.dismiss();
      this.navCtrl.navigateForward('/' + page);
    } else if (page === 'metadatos2') {
      l.dismiss();
      this.navCtrl.navigateForward('/' + page);
    } else if (page === 'ia') {
      l.dismiss();
      this.navCtrl.navigateForward('/' + page);
    }else if (page === 'reporteestega') {
      l.dismiss();
      this.navCtrl.navigateForward('/' + page);
    } else if (page === 'reporte') {
      l.dismiss();
      this.navCtrl.navigateForward('/' + page);
    } else if (page === 'reportemeta') {
      l.dismiss();
      this.navCtrl.navigateForward('/' + page);
    } else if (page === 'subir-img') {
      l.dismiss();
      this.navCtrl.navigateForward('/' + page);
    } else if (page === 'informacion') {
      l.dismiss();
      this.navCtrl.navigateForward('/' + page);
    } else if (page === 'estadisticas') {
      l.dismiss();
      this.navCtrl.navigateForward('/' + page);
    } else if (page === 'investigaciones') {
      l.dismiss();
      this.navCtrl.navigateForward('/' + page);
    }
  }

  CargarMenu() {
    const userSession = JSON.parse(localStorage.getItem('userSession'));
    this.listaMenu

  }
  cerrarsesion() {
    // this.serU.logout()
    this.servG.irA('/investigaciones')

  }
}