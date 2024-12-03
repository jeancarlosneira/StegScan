import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PdfsService {

 
  constructor(
    private http:HttpClient,
    private servG:GeneralService
  ) { }
  listarReportesestegapdf(id_invg:number): Observable<any> {
    return this.http.get(this.servG.URLAPI+'listarReportesestegapdf?id_repestego='+id_invg);
  }
  

}
