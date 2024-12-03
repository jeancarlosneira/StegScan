import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
 
  constructor(
    private http: HttpClient,
    private servG: GeneralService
  ) { }
  
  generatereport(objrep:any){
    return this.http.post(this.servG.URLAPI +
      (objrep.id_reporteela == 0 ? 'insertarreporte' : objrep.id_reporteela)
      , this.servG.objectToFormData(
        {
          id_reporteela: objrep.id_reporteela,
          nombrerep: objrep.nombrerep,
          fecha_inicio: objrep.fecha_inicio,
          id_imagen: objrep.id_imagen,
          urlimagenela: objrep.urlimagenela,
          estadorepela: objrep.estadorepela,
          porcentaje: objrep.porcentaje,
          highBrightnessPercentage: objrep.highBrightnessPercentage,
          lowBrightnessPercentage: objrep.lowBrightnessPercentage,
          intermediateBrightnessPercentage: objrep.intermediateBrightnessPercentage,
          
          
        }
      ));

  }
  generatereportmeta(objrep:any){
    return this.http.post(this.servG.URLAPI +
      (objrep.id_repmeta == 0 ? 'insertarreportemeta' : objrep.id_repmeta)
      , this.servG.objectToFormData(
        {
          id_repmeta: objrep.id_repmeta,
          id_imagen : objrep.id_imagen ,
          nombrerepmeta: objrep.nombrerepmeta,
          fecha_inicio: objrep.fecha_inicio,
        }
      ));

  }
  generatereportstega(objrep:any){
    return this.http.post(this.servG.URLAPI +
      (objrep.id_repestego  == 0 ? 'insertarestego' : objrep.id_repestego )
      , this.servG.objectToFormData(
        {
          id_repestego : objrep.id_repestego ,
          nombrerepstego : objrep.nombrerepstego ,
          chis: objrep.chis,
          
          fecharepestego: objrep.fecharepestego,
          id_imagen : objrep.id_imagen ,
          estadoesteg : objrep.estadoesteg ,
          smallJumpMax: objrep.smallJumpMax,
          largeJumpCount: objrep.largeJumpCount,
          veryLargeJumpCount: objrep.veryLargeJumpCount,
          totalJumpCount: objrep.totalJumpCount,
          percentageSteganography: objrep.percentageSteganography,

        }
      ));

  }

  listarreportesestega(id_invg){
    return this.http.get(this.servG.URLAPI+'listarReportesestega?id_investigacion='+id_invg);
    
  }
  listarreportes(id_invg){
    return this.http.get(this.servG.URLAPI+'listarReportesinfo?id_investigacion='+id_invg);
    
  }
  listarreportesmeta(id_investigacion){
    return this.http.get(this.servG.URLAPI+'listarreportesmeta?id_investigacion='+id_investigacion);
    
  }
  verificarReporte(nombrerep: string) {
    return this.http.get<{ bandera: number, mensaje: string }>(this.servG.URLAPI+'listarreportesmeta?id_usuario='+nombrerep );
  }
  fun_validar_reporte(obj){
    return this.http.get<{ bandera: number, mensaje: string }>(this.servG.URLAPI+'validarReporte?nombrerep='+obj.nombrerep+'&id_investigacion='+obj.id_investigacion);
  }
  fun_validar_reporte_meta(obj){
    return this.http.get<{ bandera: number, mensaje: string }>(this.servG.URLAPI+'validarReportemeta?nombrerepmeta='+obj.nombrerepmeta+'&id_investigacion='+obj.id_investigacion);
  }
  fun_validar_reporte_estega(obj){
    return this.http.get<{ bandera: number, mensaje: string }>(this.servG.URLAPI+'validarReporteestega?nombrerepstego='+obj.nombrerepstego+'&id_investigacion='+obj.id_investigacion);
  }

  eliminarrepsteg(id_invg: number){
    return this.http.get(this.servG.URLAPI + 'eliminarrepesteg?id_repestego=' + id_invg);
  }
  eliminarrepela(id_invg: number){
    return this.http.get(this.servG.URLAPI + 'eliminarrepela?id_reporteela=' + id_invg);
  }
  eliminarrepmeta(id_invg: number){
    return this.http.get(this.servG.URLAPI + 'eliminarrepmeta?id_repmeta=' + id_invg);
  }
}
