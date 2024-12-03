import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {
  public id_usuario :number=0;
  public usuario :string='';
  public correo_usu :string='';
  public contra_usu :string='';
  public fecha_reg_usu: string;
  public celular_usu :number=0;
  public tipousu:any;

  constructor(
    public servG:GeneralService,
    private loading:LoadingController,
    public servU:UsuariosService,
    
  ) {
    
   }

  ngOnInit() {
    this.fecha_reg_usu1 = new Date().toISOString().slice(0, 10);
  }
  
  fecha_reg_usu1: string;
  tipousu1:string='usu';
  async fun_grabar_usuario(){
    
    console.log(this.usuario)
    console.log(this.fecha_reg_usu1)
    console.log(this.tipousu1)
    if(this.usuario==''){
      this.servG.fun_Mensaje('Debe registrar el usuario','warning');

    }else if(this.contra_usu==''){
      this.servG.fun_Mensaje('Debe registrar la contraseña','warning');
    }else{
    let l=await this.loading.create()
    l.present();
    this.servU.fun_grabar_usuario_usu({
      id_usuario:this.id_usuario,
      usuario: this.usuario,
      contra_usu:this.contra_usu,
      correo_usu:this.correo_usu,
      fecha_reg_usu:this.fecha_reg_usu1,
      celular_usu:this.celular_usu,
      
      
    }).subscribe((data:any)=>{
      l.dismiss();
      this.servG.fun_Mensaje(data.mensaje)
    },(error)=>{
    l.dismiss();
    this.servG.fun_Mensaje('error al grabar el cliente','danger');
    }
    )
    }
    this.servG.irA('/inicio-sesion')
  }
 


}
