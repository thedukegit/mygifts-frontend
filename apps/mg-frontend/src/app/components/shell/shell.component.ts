import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatMenuModule,
    
    CommonModule,
  ],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  title = 'mg-frontend';
  currentPageTitle = 'Dashboard';
  sidenavExpanded = true;
  readonly authService = inject(AuthService);
  readonly userService = inject(UserService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  
  readonly currentUser$ = this.userService.getCurrentUserDoc();

  public constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => this.updateTitleFromRoute());
  }

  private updateTitleFromRoute() {
    let deepest = this.route.firstChild;
    const titleFromRoute = deepest?.snapshot.data?.['title'];
    this.currentPageTitle = titleFromRoute ?? 'Dashboard';
  }

  toggleSidenav() {
    this.sidenavExpanded = !this.sidenavExpanded;
  }

  async onLogout() {
    await this.authService.signOut();
    await this.router.navigate(['/login']);
  }
}


