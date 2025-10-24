import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent {
  title = 'mg-frontend';
  currentPageTitle = 'Dashboard';
  sidenavExpanded = true;
  menuOpen = false;
  @ViewChild('userMenuRef') userMenuRef?: ElementRef<HTMLElement>;
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

  toggleUserMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.menuOpen) return;
    const target = event.target as Node | null;
    const host = this.userMenuRef?.nativeElement;
    if (host && target && !host.contains(target)) {
      this.menuOpen = false;
    }
  }

  async onLogout() {
    await this.authService.signOut();
    await this.router.navigate(['/login']);
  }
}


