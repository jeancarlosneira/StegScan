import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { InvestigacionesService } from 'src/app/services/investigaciones.service';
import { AlertController } from '@ionic/angular';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-investigaciones',
  templateUrl: './investigaciones.page.html',
  styleUrls: ['./investigaciones.page.scss'],
})
export class InvestigacionesPage implements OnInit {

  listarinvestigaciones: any[] = [];
  id_investigacion: any;
  public id_usuario: any;

  constructor(
    private loading: LoadingController,
    private servInvg: InvestigacionesService,
    public servG: GeneralService,
    private alertController: AlertController,
    private servU: UsuariosService
  ) { }

  ngOnInit() {
    this.retornarusu();
  }
  ionViewWillEnter() {
    const userSession = JSON.parse(localStorage.getItem('idusu'));
    if (userSession) {
      this.id_usuario = userSession;
      this.cargarreinvg();
    } else {
      console.log('No hay usuario autenticado');
      this.servG.irA('/login'); // Redirige al login si no hay sesión activa
    }
  }
  retornarusu() {
    const userSession = JSON.parse(localStorage.getItem('idusu'));
    this.id_usuario = userSession;
    console.log('ID usuario:', userSession);
    return this.id_usuario
  }

  async cargarreinvg() {
    if (!this.id_usuario) {
      console.log('No hay usuario autenticado. No se cargarán investigaciones.');
      this.listarinvestigaciones = [];
      return;
    }

    let l = await this.loading.create();
    l.present();

    this.servInvg.listarinvestigaciones(this.id_usuario).subscribe(
      (respuesta: any) => {
        this.listarinvestigaciones = respuesta.data || [];
        console.log('Investigaciones cargadas:', this.listarinvestigaciones);
        l.dismiss();
      },
      (error: any) => {
        console.error('Error al recuperar las investigaciones:', error);
        l.dismiss();
        this.servG.fun_Mensaje('Error al recuperar las investigaciones');
      }
    );
  }


  addinvestigacion() {
    this.servG.irA('/addinvestigacion')
  }

  async selectinvg(id_investigacion: number, name_invg: any) {
    console.log(id_investigacion)
    await localStorage.setItem('id_investigacion', id_investigacion.toString());
    await localStorage.setItem('name_invg', name_invg.toString());

    console.log(id_investigacion)
    this.servG.irA('/main')
  }

  async salir() {
    this.servG.irA('/reginv')
  }

  
  async eliminarInvestigacion(id_investigacion: number) {

    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: 'Al eliminar la investigacion, se eliminarán los reportes relacionados con esta investigación incluido imagenes',
      buttons: [
        {
          text: 'Eliminar investigacion/Reportes',
          handler: () => {

            console.log(id_investigacion, this.id_usuario)
            this.eliminartodo(id_investigacion, this.id_usuario); // Llama a la función para eliminar imagen y reportes
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          handler: () => {
            console.log('Operación cancelada');
          }
        }
      ]
    });

    await alert.present();

  }

  async eliminartodo(id_investigacion: number, id_usuario: number) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: '¿Seguro desea eliminar todos los reportes con la investigación?',
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            this.servInvg.eliminarinvg(id_investigacion).subscribe(
              (respuesta: any) => {
                console.log('Investigación eliminada con éxito:', respuesta);
                this.cargarreinvg(); // Recargar lista de investigaciones
              },
              (error: any) => {
                console.error('Error al eliminar:', error);
                this.servG.fun_Mensaje('Error al eliminar la investigación.');
              }
            );
          },
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Operación cancelada');
          },
        },
      ],
    });

    await alert.present();
  }

  invgfinalizadas() {
    this.servG.irA('/invgterminadas')

  }


}
