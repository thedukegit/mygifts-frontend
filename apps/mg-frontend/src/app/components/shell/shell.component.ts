import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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
export class ShellComponent implements OnInit {
  title = 'mg-frontend';
  sidenavExpanded = true;
  menuOpen = false;
  @ViewChild('userMenuRef') userMenuRef?: ElementRef<HTMLElement>;
  readonly authService = inject(AuthService);
  readonly userService = inject(UserService);
  readonly currentUser$ = this.userService.getCurrentUserDoc();
  private readonly MOBILE_BREAKPOINT = 768; // Tablets and phones
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    this.checkScreenSize();
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

  private checkScreenSize(): void {
    const width = window.innerWidth;
    if (width < this.MOBILE_BREAKPOINT) {
      this.sidenavExpanded = false;
    } else {
      // On larger screens, keep the expanded state (don't force expand if user collapsed it manually)
      // If you want to auto-expand on larger screens, uncomment the next line:
      // this.sidenavExpanded = true;
    }
  }
}
