import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { NavBarModule } from '@mygifts/desktop/shell/ui/nav-bar';
import { BreadcrumbModule } from 'primeng/breadcrumb';

@NgModule({
  imports: [CommonModule, NavBarModule, BreadcrumbModule],
  declarations: [LayoutComponent],
  exports: [LayoutComponent],
})
export class LayoutModule {}
