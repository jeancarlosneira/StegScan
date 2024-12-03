import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {

  constructor(
    private http:HttpClient,
    private servG:GeneralService
  ) { }
  obtenerCantidadReportesestega(id_invg:number): Observable<any> {
    return this.http.get(this.servG.URLAPI+'contarreportesestego?id_investigacion='+id_invg);
  }
  obtenerCantidadReportela(id_invg:number): Observable<any> {
    return this.http.get(this.servG.URLAPI+'contarreportesela?id_investigacion='+id_invg);
  }

  obtenerCantidadReportesMeta(id_invg:number): Observable<any> {
    return this.http.get(this.servG.URLAPI+'contarreportesmeta?id_investigacion='+id_invg);
  }
  

  obtenerCantidadela(id_invg:number): Observable<any> {
    return this.http.get(this.servG.URLAPI+'obtenerCantidadela?id_investigacion='+id_invg);
  }
  obtenerCantidadsinela(id_invg:number): Observable<any> {
    return this.http.get(this.servG.URLAPI+'obtenerCantidadsinela?id_investigacion='+id_invg);
  }
  obtenerCantidadsteg(id_invg:number): Observable<any> {
    return this.http.get(this.servG.URLAPI+'obtenerCantidadsteg?id_investigacion='+id_invg);
  }
  obtenerCantidadsinsteg(id_invg:number): Observable<any> {
    return this.http.get(this.servG.URLAPI+'obtenerCantidadsinsteg?id_investigacion='+id_invg);
  }
}
