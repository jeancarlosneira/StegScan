import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-reginv',
  templateUrl: './reginv.page.html',
  styleUrls: ['./reginv.page.scss'],
})
export class ReginvPage implements OnInit {

  constructor(
    private servG:GeneralService,
    private alertController: AlertController,
    private servU:UsuariosService
  ) { }

  ngOnInit() {
  }
  nuevocaso(){
    this.servG.irA('/addinvestigacion')
  }
  async salir(){
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Cierre de sesión cancelado');
          },
        },
        {
          text: 'Cerrar sesión',
          handler: () => {
            this.servU.logout(); // Cierra la sesión
            
          },
        },
      ],
    });

    await alert.present();
  }
  editarcaso(){
this.servG.irA('/investigaciones')
  }
  informacion(){
    this.servG.irA('/informacion')
  }
  
  
}
