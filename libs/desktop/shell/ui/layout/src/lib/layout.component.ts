import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'mg-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent implements OnInit {
  @Input() public breadcrumbs: MenuItem[] = [];
  public home: MenuItem = {};

  public ngOnInit(): void {
    this.home = { icon: 'pi pi-home', routerLink: '/' };
  }
}
