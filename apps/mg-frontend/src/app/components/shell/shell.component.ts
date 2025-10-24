import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, HostListener, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
  sidenavExpanded = true;
  menuOpen = false;
  @ViewChild('userMenuRef') userMenuRef?: ElementRef<HTMLElement>;
  readonly authService = inject(AuthService);
  readonly userService = inject(UserService);
  private readonly router = inject(Router);
  
  readonly currentUser$ = this.userService.getCurrentUserDoc();



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


