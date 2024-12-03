import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { ReporteService } from 'src/app/services/reporte.service';

@Component({
  selector: 'app-reporteestega',
  templateUrl: './reporteestega.page.html',
  styleUrls: ['./reporteestega.page.scss'],
})
export class ReporteestegaPage implements OnInit {
  listareporteestega: any[] = [];
  id_investigacion: any;
  estadoivg: any;
  constructor(
    private loading: LoadingController,
    private servRep: ReporteService,
    public servG: GeneralService,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.retornarinvg();
  }
  ionViewWillEnter() {
    this.cargarreportes();
  }
  retornarpage() {
    this.servG.irA('/main');
  }

  retornarinvg() {
    const userSession = JSON.parse(localStorage.getItem('id_investigacion'));
    this.id_investigacion = userSession;
    console.log('id_investigacion:', userSession);
    return this.id_investigacion
  }
  async cargarreportes() {
    let l = await this.loading.create();
    l.present();
    this.servRep.listarreportesestega(this.id_investigacion).subscribe(
      (respuesta: any) => {
        this.listareporteestega = respuesta.data;
        this.estadoivg = respuesta.data.estadoesteg;
        console.log('lista reporte' + this.listareporteestega);
        l.dismiss();

      }, (error: any) => {
        l.dismiss();
        this.servG.fun_Mensaje("error al recuperar los reportes")
      }

    );
    this.estado = this.listareporteestega

  }
  public estegoanalisis: string;
  estado: any;
  async borrarReport(id_invg: number) {
    const alert = await this.alertController.create({
      header: 'Confirmación',
      message: 'Esta seguro de eliminar el reporte?.',

      buttons: [
        {
          text: 'Eliminar Reportes',
          handler: () => {
            this.borrarrep(id_invg);
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

  borrarrep(id_invg) {

    interface RespuestaEliminar {
      mensaje: string;
    }
    this.servRep.eliminarrepsteg(id_invg).subscribe(
      (response: RespuestaEliminar) => {
        this.servG.fun_Mensaje(response.mensaje, 'success');
      },
      (error) => {
        this.servG.fun_Mensaje('Error al eliminar el reporte', 'danger');
      }
    );
    this.actualizarImagenes();
  }
  async actualizarImagenes() {
    // Actualizar la lista de imágenes
    await this.cargarreportes();  // Llama a cargarimagenes para recargar las imágenes
  }
  objectKeys(obj: any): string[] {
    return Object.keys(obj);
  }
}
