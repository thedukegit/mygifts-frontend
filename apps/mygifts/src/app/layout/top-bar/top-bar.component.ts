import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppBreadcrumb } from '../../../../../../libs/mygifts/layout/src/lib/layout/app.breadcrumb';
import { ButtonModule } from 'primeng/button';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { LayoutService } from '../layout.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-top-bar]',
  imports: [
    RouterModule,
    CommonModule,
    StyleClassModule,
    AppBreadcrumb,
    InputTextModule,
    ButtonModule,
    IconFieldModule,
    InputIconModule,
  ],
  standalone: true,
  templateUrl: './top-bar.component.html',
})
export class TopBarComponent {
  @ViewChild('menubutton') menuButton!: ElementRef;

  constructor(public layoutService: LayoutService) {}

  onMenuButtonClick() {
    this.layoutService.onMenuToggle();
  }

  onProfileButtonClick() {
    this.layoutService.showProfileSidebar();
  }

  onConfigButtonClick() {
    this.layoutService.showConfigSidebar();
  }
}
