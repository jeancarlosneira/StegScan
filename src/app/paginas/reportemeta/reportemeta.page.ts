import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { JsonPrettyPipe } from 'src/app/pipes/json-pretty.pipe';
import { GeneralService } from 'src/app/services/general.service';

import { ReporteService } from 'src/app/services/reporte.service';

@Component({
  selector: 'app-reportemeta',
  templateUrl: './reportemeta.page.html',
  styleUrls: ['./reportemeta.page.scss'],
  
})
export class ReportemetaPage implements OnInit {
  listareportesmeta:any[]=[];
  idusuario:any;
  
    constructor(
      private loading:LoadingController,
      private servRep:ReporteService,
      public servG:GeneralService,
      private alertController: AlertController,
    ) { }
  
    ngOnInit() {
      this.retornarusu();
      this.retornarinvg();
    }
    ionViewWillEnter() {
      this.cargarreportes();
    }
  
    retornarpage() {
      this.servG.irA('/main');
    }
    meta:any;
   metadatos:any={};
    metadatosJSON: string = '';

    async cargarreportes(){
      let l=await this.loading.create();
      l.present();
      this.servRep.listarreportesmeta(this.id_investigacion).subscribe(
        (respuesta:any)=>{
          this.listareportesmeta=respuesta.data;
          
          let metadatosExtraidos = respuesta.data.map(item => {
            try {
              return JSON.parse(item.metadatos);  // Convertir la cadena JSON a un objeto
            } catch (e) {
              return {};  // En caso de que no sea un JSON válido
            }
            
          }
        );
        console.log(this.metadatos)
    
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
  
    
    objectKeys(obj: any): string[] {
      return Object.keys(obj);
    }
    async borrarReport(id_invg: number) {
      const alert = await this.alertController.create({
        header: 'Confirmación',
        message: 'Esta seguro de eliminar el reporte?.',
  
        buttons: [
          {
            text: 'Eliminar Reporte',
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
      this.servRep.eliminarrepmeta(id_invg).subscribe(
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


}
