import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { CommonModule } from '@angular/common';

interface Notification {
  icon: string;
  message: string;
}

@Component({
  imports: [
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatMenuModule,
    MatBadgeModule,
    CommonModule,
  ],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'mg-frontend';
  currentPageTitle = 'Dashboard';
  notificationCount = 0;
  notifications: Notification[] = [];

  constructor() {
    // Example notifications - in a real app, these would come from a service
    this.notifications = [
      { icon: 'shopping_cart', message: 'New gift added to your list' },
      { icon: 'event', message: 'Birthday reminder: John Doe' },
    ];
    this.notificationCount = this.notifications.length;
  }
}
