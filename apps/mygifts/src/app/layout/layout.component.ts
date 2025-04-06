import { Component, OnDestroy, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AppConfigurator } from '../../../../../libs/mygifts/layout/src/lib/layout/app.configurator';
import { filter, Subscription } from 'rxjs';
import { SideBarComponent } from './side-bar/side-bar.component';
import { TopBarComponent } from './top-bar/top-bar.component';
import { LayoutService } from './layout.service';

/** responsible for the common components of the screen, like top bar, menu, etc. **/
@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    TopBarComponent,
    AppConfigurator,
    SideBarComponent,
  ],
  standalone: true,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnDestroy {
  overlayMenuOpenSubscription: Subscription;

  menuOutsideClickListener: any;

  menuScrollListener: any;

  @ViewChild(SideBarComponent) appSidebar!: SideBarComponent;

  @ViewChild(TopBarComponent) appTopBar!: TopBarComponent;

  constructor(
    public layoutService: LayoutService,
    public renderer: Renderer2,
    public router: Router
  ) {
    this.overlayMenuOpenSubscription =
      this.layoutService.overlayOpen$.subscribe(() => {
        if (!this.menuOutsideClickListener) {
          this.menuOutsideClickListener = this.renderer.listen(
            'document',
            'click',
            (event) => {
              if (this.isOutsideClicked(event)) {
                this.hideMenu();
              }
            }
          );
        }
        if (
          (this.layoutService.isHorizontal() ||
            this.layoutService.isSlim() ||
            this.layoutService.isSlimPlus()) &&
          !this.menuScrollListener
        ) {
          this.menuScrollListener = this.renderer.listen(
            this.appSidebar.menuContainer.nativeElement,
            'scroll',
            (event) => {
              if (this.layoutService.isDesktop()) {
                this.hideMenu();
              }
            }
          );
        }
        if (this.layoutService.layoutState().staticMenuMobileActive) {
          this.blockBodyScroll();
        }
      });

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.hideMenu();
      });
  }

  get containerClass() {
    const layoutConfig = this.layoutService.layoutConfig();
    const layoutState = this.layoutService.layoutState();

    return {
      'layout-light': !layoutConfig.darkTheme,
      'layout-dark': layoutConfig.darkTheme,
      'layout-colorscheme-menu': layoutConfig.menuTheme === 'colorScheme',
      'layout-primarycolor-menu': layoutConfig.menuTheme === 'primaryColor',
      'layout-transparent-menu': layoutConfig.menuTheme === 'transparent',
      'layout-overlay': layoutConfig.menuMode === 'overlay',
      'layout-static': layoutConfig.menuMode === 'static',
      'layout-slim': layoutConfig.menuMode === 'slim',
      'layout-slim-plus': layoutConfig.menuMode === 'slim-plus',
      'layout-horizontal': layoutConfig.menuMode === 'horizontal',
      'layout-reveal': layoutConfig.menuMode === 'reveal',
      'layout-drawer': layoutConfig.menuMode === 'drawer',
      'layout-static-inactive':
        layoutState.staticMenuDesktopInactive &&
        layoutConfig.menuMode === 'static',
      'layout-overlay-active': layoutState.overlayMenuActive,
      'layout-mobile-active': layoutState.staticMenuMobileActive,
      'layout-sidebar-active': layoutState.sidebarActive,
      'layout-sidebar-anchored': layoutState.anchored,
    };
  }

  isOutsideClicked(event: any) {
    const sidebarEl = document.querySelector('.layout-sidebar');
    const topbarButtonEl = document.querySelector('.topbar-menubutton');

    return !(
      sidebarEl?.isSameNode(event.target) ||
      sidebarEl?.contains(event.target) ||
      topbarButtonEl?.isSameNode(event.target) ||
      topbarButtonEl?.contains(event.target)
    );
  }

  hideMenu() {
    this.layoutService.layoutState.update((prev) => ({
      ...prev,
      overlayMenuActive: false,
      staticMenuMobileActive: false,
      menuHoverActive: false,
    }));
    this.layoutService.reset();
    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
      this.menuOutsideClickListener = null;
    }

    if (this.menuScrollListener) {
      this.menuScrollListener();
      this.menuScrollListener = null;
    }

    this.unblockBodyScroll();
  }

  blockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.add('blocked-scroll');
    } else {
      document.body.className += ' blocked-scroll';
    }
  }

  unblockBodyScroll(): void {
    if (document.body.classList) {
      document.body.classList.remove('blocked-scroll');
    } else {
      document.body.className = document.body.className.replace(
        new RegExp(
          '(^|\\b)' + 'blocked-scroll'.split(' ').join('|') + '(\\b|$)',
          'gi'
        ),
        ' '
      );
    }
  }

  ngOnDestroy() {
    if (this.overlayMenuOpenSubscription) {
      this.overlayMenuOpenSubscription.unsubscribe();
    }

    if (this.menuOutsideClickListener) {
      this.menuOutsideClickListener();
    }
  }
}
