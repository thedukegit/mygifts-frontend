import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../layout.service';
import { RouterLink } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-side-bar]',
  imports: [CommonModule, RouterLink, MenuComponent],
  templateUrl: './side-bar.component.html',
})
export class SideBarComponent {
  timeout: any = null;

  @ViewChild('menuContainer') menuContainer!: ElementRef;

  constructor(public layoutService: LayoutService, public el: ElementRef) {}

  onMouseEnter() {
    if (!this.layoutService.layoutState().anchored) {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }

      this.layoutService.layoutState.update((state) => {
        if (!state.sidebarActive) {
          return {
            ...state,
            sidebarActive: true,
          };
        }
        return state;
      });
    }
  }

  onMouseLeave() {
    if (!this.layoutService.layoutState().anchored) {
      if (!this.timeout) {
        this.timeout = setTimeout(() => {
          this.layoutService.layoutState.update((state) => {
            if (state.sidebarActive) {
              return {
                ...state,
                sidebarActive: false,
              };
            }
            return state;
          });
        }, 300);
      }
    }
  }
}
