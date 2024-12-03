import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InvestigacionesService {

  constructor(
    private http: HttpClient,
    private servG: GeneralService
  ) { }
  generateinvestigacion(objrep: any) {
    return this.http.post(this.servG.URLAPI +
      (objrep.id_investigacion == 0 ? 'insertarinvg' : objrep.id_investigacion)
      , this.servG.objectToFormData(
        {
          id_investigacion: objrep.id_investigacion,
          name_invg: objrep.name_invg,
          fecha_inicio: objrep.fecha_inicio,
          descripcion_ing:objrep.descripcion_ing,
          fecha_fin: objrep.fecha_fin,
          id_usuario: objrep.id_usuario,
          estadoinvg: objrep.estadoinvg,
          
        }
      ));

  }
  listarinvestigaciones(usuario_id) {
    return this.http.get(this.servG.URLAPI + 'retornarinvg?id_usuario=' + usuario_id);
  }
  listarinvestigacionesfin(usuario_id) {
    // return this.http.get(this.servG.URLAPI+'listarinvg?usuario_id='+usuario_id);
    
    return this.http.get(this.servG.URLAPI + 'retornarinvgfin?id_usuario=' + usuario_id);
  }

  guardaridusuinvg(id_usuario: number) {
    id_usuario = id_usuario
    console.log('id usuario en repor' + id_usuario)
    return id_usuario
  }
  eliminarinvg(id_investigacion: number) {
    return this.http.get(this.servG.URLAPI + `eliminarinvg?id_investigacion=${id_investigacion}`);
  }
  finalizarInvestigacion(id_investigacion: number) {
    return this.http.get(this.servG.URLAPI + 'finalizarInvestigacion?id_investigacion=' + id_investigacion);
  }
  
  retornartodoinvrg(id_investigacion:number){
    return this.http.get(this.servG.URLAPI + 'imprimirinvg?id_investigacion=' + id_investigacion);
  }

  retornarinvgpdf(id_investigacion:number,id_usuario:number){
    return this.http.get(this.servG.URLAPI + 'retornarinvgpdf?id_investigacion=' + id_investigacion+'&id_usuario='+ id_usuario);
  }  
  
}
