import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
export class ImagenesService {

  constructor(
    private http: HttpClient,
    private servG: GeneralService
  ) { }
  
  fun_grabar_imagenes(objimagenes: any) {

    return this.http.post(this.servG.URLAPI +

      (objimagenes.id_imagen == 0 ? 'insertarimagenes' : objimagenes.id_imagen)

      , this.servG.objectToFormData(
        {
          id_imagen: objimagenes.id_imagen,
          metadatos: objimagenes.metadatos,
          hash: objimagenes.hash,
          id_invg:objimagenes.id_invg,         
          url_imagen: objimagenes.url_imagen,
          nombreimg: objimagenes.nombreimg,
        }
      ));

  }
  fun_validar_imagen(obj){
    return this.http.get(this.servG.URLAPI+'validarimg?hash='+obj.hash+'&id_invg='+obj.id_invg);
  }
  retornarimg(id_invg){
    console.log(id_invg)
    return this.http.get(this.servG.URLAPI+'retornarimg?id_invg='+id_invg);
  }
  retornardataimg(id_imagen){
    console.log(id_imagen)
    return this.http.get(this.servG.URLAPI+'retornardataimg?id_imagen='+id_imagen);
  }
  eliminarimg(id_imagen: number){
    return this.http.get(this.servG.URLAPI + 'eliminarimg?id_imagen=' + id_imagen);
  }
  verificarimg(hash:any){
    return this.http.get(this.servG.URLAPI+'verificarImagen?hash='+hash);
  }

}
