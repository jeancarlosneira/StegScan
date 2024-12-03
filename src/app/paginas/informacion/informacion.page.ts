import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-informacion',
  templateUrl: './informacion.page.html',
  styleUrls: ['./informacion.page.scss'],
})
export class InformacionPage implements OnInit {

  constructor(
    public servG: GeneralService
  ) { }

  ngOnInit() {
  }
  retornar(){
    this.servG.irA('/reginv')
    
  }

}
