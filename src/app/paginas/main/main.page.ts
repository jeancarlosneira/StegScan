import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { InvestigacionesService } from 'src/app/services/investigaciones.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
})
export class MainPage implements OnInit {
  public idusuario: number;
  public id_investigacion: number;
  public name_invg: any;
  constructor(
    private navCtrl: NavController,
    private servUsu: UsuariosService,
    private alertController: AlertController,
    private servG: GeneralService,
    private loading:LoadingController,
    private servInvg:InvestigacionesService
  ) { }

  async ngOnInit() {
    await this.retornarusu();
    await this.retornarinvg();
    await this.retornanameinvg();
    await this.servUsu.retornarusuario(this.idusuario)
  }

  toggleFab() {

  }
  retornarusu() {
    const userSession = JSON.parse(localStorage.getItem('idusu'));
    this.idusuario = userSession;
    console.log('id usuario: ' + userSession);
  }
  retornarinvg() {
    const id = JSON.parse(localStorage.getItem('id_investigacion'));
    this.id_investigacion = id;
    console.log('ID investigacion:', id);
    return this.id_investigacion
  }
  name_invg1:string;
  retornanameinvg() {
    const name_invg = localStorage.getItem('name_invg');
    this.name_invg = name_invg;
    console.log('nombre invg:', name_invg);
    return this.name_invg1
  }
  info() {
    this.servG.irA('/usoapp')
  }
  async salir() {
    await localStorage.removeItem('id_investigacion');
    await localStorage.removeItem('name_invg');
    this.navCtrl.navigateForward('/investigaciones');
  }
  
  async terminarinvg() {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Está seguro de querer terminar la investigación?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cierre de la investigación cancelado');
          },
        },
        {
          text: 'Terminar Investigación',
          handler: () => {
            this.terminarinvgfinal();
          },
        },
      ],
    });

    await alert.present();
  }

  async terminarinvgfinal() {
    const loading = await this.loading.create({
      message: 'Finalizando investigación...',
    });
    await loading.present();
    console.log(this.id_investigacion)
    this.servInvg.finalizarInvestigacion(this.id_investigacion).subscribe(
      
      async (response: any) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: response.mensaje,
          buttons: ['OK'],
        });
        await alert.present();
  
        // Navegar o actualizar la página según sea necesario
        this.salir();
      },
      async (error) => {
        await loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Hubo un problema al finalizar la investigación.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    );
  }


}
