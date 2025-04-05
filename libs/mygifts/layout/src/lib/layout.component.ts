import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/** responsible for the common components of the screen, like top bar, menu, etc. **/
@Component({
  selector: 'lib-layout',
  imports: [CommonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {}
