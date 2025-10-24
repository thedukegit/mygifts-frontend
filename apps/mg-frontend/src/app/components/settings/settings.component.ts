import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  isDark = this.getInitialTheme() === 'dark';

  toggleTheme(): void {
    this.setTheme(this.isDark ? 'light' : 'dark');
  }

  private setTheme(theme: 'light' | 'dark'): void {
    this.isDark = theme === 'dark';
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', this.isDark);
  }

  private getInitialTheme(): 'light' | 'dark' {
    try {
      const persisted = localStorage.getItem('theme');
      if (persisted === 'light' || persisted === 'dark') return persisted;
    } catch {}
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
}


