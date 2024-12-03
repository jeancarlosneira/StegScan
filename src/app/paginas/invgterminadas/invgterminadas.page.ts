import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { InvestigacionesService } from 'src/app/services/investigaciones.service';
import { ReporteService } from 'src/app/services/reporte.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-invgterminadas',
  templateUrl: './invgterminadas.page.html',
  styleUrls: ['./invgterminadas.page.scss'],
})
export class InvgterminadasPage implements OnInit {
  listareportes:any[]=[];
  listareportes2:any[]=[];
  listareportes3:any[]=[];
  constructor(
    private loading: LoadingController,
    private servInvg: InvestigacionesService,
    public servG: GeneralService,
    private alertController: AlertController,
    private servRep:ReporteService,
  ) { }
  public id_usuario: any;
  listarinvestigaciones: any[] = [];
  id_investigacion: any;
  ngOnInit() {
    this.retornarusu();
  }
  retornarusu() {
    const userSession = JSON.parse(localStorage.getItem('idusu'));
    this.id_usuario = userSession;
    console.log('ID usuario:', userSession);
    return this.id_usuario
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
  
  async cargarreinvg() {
    if (!this.id_usuario) {
      console.log('No hay usuario autenticado. No se cargarán investigaciones.');
      this.listarinvestigaciones = [];
      return;
    }
  
    let l = await this.loading.create();
    l.present();
  console.log('id usu: '+this.id_usuario)
    this.servInvg.listarinvestigacionesfin(this.id_usuario).subscribe(
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

salir(){
  this.servG.irA('/investigaciones')
}

async eliminarInvestigacion(id_investigacion: number) {

  const alert = await this.alertController.create({
    header: 'Confirmación',
    message: 'Al eliminar la investigacion, se eliminarán los reportes relacionados con esta investigación incluido imagenes',
    buttons: [
      {
        text: 'Eliminar investigacion/Reportes',
        handler: () => {
          this.borrarrep(id_investigacion)
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
  this.servInvg.eliminarinvg(id_invg).subscribe(
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
  await this.cargarreinvg();  // Llama a cargarimagenes para recargar las imágenes
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
async selectinvg(id_investigacion: number) {
  await localStorage.setItem('id_investigacion', id_investigacion.toString());
  this.servG.irA('/reportfin')
}
imprimirinvestigacion(id_investigacion:number){
  

}

}
