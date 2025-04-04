import { Route } from '@angular/router';
import { LayoutComponent } from 'layout';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    // children: [
    //   {
    //     path: '',
    //     loadComponent: () => import('./app/pages/dashboards/ecommercedashboard').then(c => c.EcommerceDashboard),
    //     data: { breadcrumb: 'E-Commerce Dashboard' },
    //   },]
  },
];
