import { Injectable } from '@angular/core';


import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  // public URLAPI:string="http://localhost:80/APPTESIS1/";
  public URLAPI:string="https://stegscan.x10.mx/APPTESIS1/";


  

  constructor(
    private router:Router,
    private toast:ToastController,
    

  ) { }
  irA(url:string){
    this.router.navigateByUrl(url);
  }
  objectToFormData(obj: any, form?: any, namespace?: any) {
    let fd: any = form || new FormData();
    let formKey: any;
    for (let property in obj) {
      if (obj.hasOwnProperty(property) && obj[property]) {
        if (namespace) {
          formKey = namespace + '[' + property + ']';
        } else {
          formKey = property;
        }
        if (obj[property] instanceof Date) {
          fd.append(formKey, obj[property].toISOString());
        }
        if (typeof obj[property] === 'object' && 
          !(obj[property] instanceof File)) {
          this.objectToFormData(obj[property], fd, formKey);
        } else {
          fd.append(formKey, obj[property]);
        }

      }
    }
    return fd;
  }
  //funcion emite mensaje
  async fun_Mensaje(texto: string, tipo: string = 'success') {
    let t = await this.toast.create({
      message: texto,
      color: tipo,
      duration: 3000
    });
    t.present();
  }
  
}
