import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-comp-ela',
  templateUrl: './comp-ela.page.html',
  styleUrls: ['./comp-ela.page.scss'],
})
export class CompElaPage implements OnInit {

  constructor(
    public servG: GeneralService,
  ) { }

  ngOnInit() {
  }

}
