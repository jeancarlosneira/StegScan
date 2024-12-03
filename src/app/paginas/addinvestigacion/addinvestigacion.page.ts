import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { GeneralService } from 'src/app/services/general.service';
import { InvestigacionesService } from 'src/app/services/investigaciones.service';

@Component({
  selector: 'app-addinvestigacion',
  templateUrl: './addinvestigacion.page.html',
  styleUrls: ['./addinvestigacion.page.scss'],
})
export class AddinvestigacionPage implements OnInit {
  id_investigacion:number=0;
  public name_invg:string;
  public fecha_inicio: string;
  public descripcion_ing:string;
  public fecha_fin: string;
  public id_usuario: number;
  
  public estadoinvg: number=1;
  constructor(
    public servG:GeneralService,
    private loading:LoadingController,
    public servInvg:InvestigacionesService,
  ) { }

  ngOnInit() {
    this.borrarfecha();
    const fecha = new Date();
    this.fecha_inicio = fecha.toISOString().slice(0, 19).replace('T', ' ');
    this.fecha_fin = fecha.toISOString().slice(0, 19).replace('T', ' ');
    console.log(this.fecha_inicio)
    this.retornarusu();
    
  }
  borrarfecha(){
    this.fecha_inicio='';
  }

  retornarpage() {
    this.servG.irA('/reginv');
  }
  retornarusu() {
    const userSession = JSON.parse(localStorage.getItem('idusu'));
    this.id_usuario = userSession;
    console.log('ID usuario:', userSession);
  return this.id_usuario
  }

  async fun_grabar_investigacion(){
    
    console.log(this.name_invg)
    console.log(this.fecha_inicio)
    console.log(this.fecha_fin)
    console.log(this.id_usuario)
    if(this.name_invg==''){
      this.servG.fun_Mensaje('Debe registrar el nombre de la investigacion','warning');
    }else if(this.fecha_inicio==''){
      this.servG.fun_Mensaje('Debe registrar la fecha de inicio','warning');
    }else{
    let l=await this.loading.create()
    l.present();
    this.servInvg.generateinvestigacion({
      id_investigacion:this.id_investigacion,
      name_invg:this.name_invg,
      fecha_inicio: this.fecha_inicio,
      descripcion_ing:this.descripcion_ing,
      fecha_fin:this.fecha_fin,
      estadoinvg:this.estadoinvg,
      id_usuario:this.id_usuario,
      
    }).subscribe((data:any)=>{
      l.dismiss();
      this.servG.fun_Mensaje(data.mensaje)
    },(error)=>{
    l.dismiss();
    this.servG.fun_Mensaje('error al grabar la investigacion','danger');
    }
    )
    }
    this.servG.irA('/investigaciones')
  }
}
