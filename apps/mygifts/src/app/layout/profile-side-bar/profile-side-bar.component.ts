import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Badge } from 'primeng/badge';
import { Drawer } from 'primeng/drawer';
import { LayoutService } from '../layout.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-profile-side-bar]',
  imports: [CommonModule, Badge, Drawer],
  standalone: true,
  templateUrl: './profile-side-bar.component.html',
})
export class ProfileSideBarComponent {
  visible = computed(
    () => this.layoutService.layoutState().profileSidebarVisible
  );

  constructor(public layoutService: LayoutService) {}

  onDrawerHide() {
    this.layoutService.layoutState.update((state) => ({
      ...state,
      profileSidebarVisible: false,
    }));
  }
}
