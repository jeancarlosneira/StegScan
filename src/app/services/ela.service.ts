import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ElaService {

  constructor(
    private http: HttpClient,
    private servG: GeneralService
  ) { }

  guardarestadoimg(objela: any) {

    return this.http.post(this.servG.URLAPI +

      (objela.id_ela == 0 ? 'insertarela' : objela.id_ela)

      , this.servG.objectToFormData(
        {
          id_ela: objela.id_ela,
          fecha: objela.fecha,
          estado_ela: objela.estado_ela,
          hash_img: objela.hash_img,
        }
      ));
      
  }

  recuperarhashimg(hash: any){
console.log('hash recuperado: '+hash)
return hash;
  }

}
