import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { ReporteService } from 'src/app/services/reporte.service';



@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.page.html',
  styleUrls: ['./reporte.page.scss'],
})
export class ReportePage implements OnInit {
listareportes:any[]=[];
idusuario:any;

  constructor(
    private loading:LoadingController,
    private servRep:ReporteService,
    private alertController: AlertController,
    public servG:GeneralService,
  ) { }

  ngOnInit() {
    this.retornarusu();
    this.retornarinvg();
    this.actualizarImagenes();
  }
  ionViewWillEnter() {
    this.cargarreportes();
  }
  retornarpage() {
    this.servG.irA('/main');
  }
  meta:any;
  metadaros:any={};
  estadoivg:any;
  async cargarreportes(){
    let l=await this.loading.create();
    l.present();
    this.servRep.listarreportes(this.id_investigacion).subscribe(
      (respuesta:any)=>{
        this.listareportes=respuesta.data;
        
      console.log( 'lista reporte: '+this.listareportes);
      l.dismiss();
      },(error:any)=>{
        l.dismiss();
        this.servG.fun_Mensaje("error al recuperar los reportes")
      }
      
    );
    
  }

  retornarusu() {
    const userSession = JSON.parse(localStorage.getItem('idusu'));
    this.idusuario = userSession;
    console.log('ID usuario:', userSession);
  return this.idusuario
  }
  id_investigacion:any;
  retornarinvg() {
    const userSession = JSON.parse(localStorage.getItem('id_investigacion'));
    this.id_investigacion = userSession;
    console.log('id_investigacion:', userSession);
    return this.id_investigacion
  } 
  async borrarReport(id_invg:number){
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
  
  borrarrep(id_invg){
    
    interface RespuestaEliminar {
      mensaje: string;
    }
    this.servRep.eliminarrepela(id_invg).subscribe(
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
  expandImage(event: any): void {
    const image = event.target as HTMLImageElement; // Obtiene la imagen clickeada
    if (image.style.transform === 'scale(1.5)') {
      image.style.transform = 'scale(1)'; // Vuelve a su tamaño original si ya está agrandada
    } else {
      image.style.transform = 'scale(1.5)'; // Agranda la imagen
    }
  }

}
