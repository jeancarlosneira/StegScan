import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {

  constructor(
    public servG: GeneralService,
    public serU: UsuariosService,
  ) { }

  ngOnInit() {
  }
  cerrarsesion(){
    this.serU.logout()
      
    }

}
