import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { PoMenuItem } from '@po-ui/ng-components';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private rota: Router ){}

  readonly menus: Array<PoMenuItem> = [
    { label: 'Home', action: this.onClick.bind(this) }
  ];

  ngOnInit(): void {
    this.rota.navigateByUrl('/main/login');
  }

  private onClick() {
    alert('Clicked in menu item')
  }

}
