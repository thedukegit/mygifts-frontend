import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppMenuitem } from '../../../../../../libs/mygifts/layout/src/lib/layout/app.menuitem';

@Component({
  selector: 'app-menu',
  imports: [CommonModule, AppMenuitem],
  templateUrl: './menu.component.html',
})
export class MenuComponent implements OnInit {
  model: any[] = [];

  ngOnInit() {
    this.model = [
      {
        label: 'General',
        icon: 'pi pi-home',
        items: [
          {
            label: 'List',
            icon: 'pi pi-fw pi-home',
            routerLink: ['/'],
          },
        ],
      },
    ];
  }
}
