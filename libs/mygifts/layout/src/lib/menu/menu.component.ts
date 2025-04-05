import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'mg-menu',
  imports: [CommonModule, Menu],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  protected items: MenuItem[] = [
    { label: 'General', icon: 'pi pi-fw pi-home', routerLink: '/' },
  ];
}
