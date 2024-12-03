import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  

  constructor(
    private http:HttpClient,
    private servG:GeneralService
  ) { }
  fun_listar_usuario(){
    return this.http.get(this.servG.URLAPI+'listarusuario');

  }
  usuario:String='usu'
  fun_grabar_usuario_usu(objUsuario:any){
    return this.http.post(this.servG.URLAPI+
      (objUsuario.id_usuario==0?'insertarusuario':'updateusuario'+objUsuario.id_usuario)
      ,this.servG.objectToFormData(
        {
          id_usuario:objUsuario.id_usuario,
          usuario:objUsuario.usuario,
          contra_usu:objUsuario.contra_usu,
          correo_usu:objUsuario.correo_usu,
          fecha_reg_usu:objUsuario.fecha_reg_usu,
          celular_usu:objUsuario.celular_usu,
        }
        ));
        
  }
  
validar(usu:string,pass:string){
    return  this.http.get(this.servG.URLAPI+'validar?usuario='+usu+'&contrasena='+pass);
}
miId:number;


async logout() {
  await localStorage.removeItem('tipoUsuario');
  await localStorage.removeItem('idusu');
  await localStorage.removeItem('name_invg');
  this.servG.irA('/inicio-sesion');  
}
retornarusuario(id_usuario:any){
  console.log('name de usuario: '+this.http.get(this.servG.URLAPI+'retornarusuario?id_usuario='+id_usuario))
  return  this.http.get(this.servG.URLAPI+'retornarusuario?id_usuario='+id_usuario);
}

}