import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppMenuitem } from './app.menuitem';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, AppMenuitem, RouterModule],
  template: `
    <ul class="layout-menu">
      <ng-container *ngFor="let item of model; let i = index">
        <li
          app-menuitem
          *ngIf="!item.separator"
          [item]="item"
          [index]="i"
          [root]="true"
        ></li>
        <li *ngIf="item.separator" class="menu-separator"></li>
      </ng-container>
    </ul>
  `,
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class AppMenu implements OnInit {
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
