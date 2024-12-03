import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-ia',
  templateUrl: './ia.page.html',
  styleUrls: ['./ia.page.scss'],
})
export class IaPage implements OnInit {

  constructor(
    public servG: GeneralService,
  ) { }

  ngOnInit() {
  }

}
