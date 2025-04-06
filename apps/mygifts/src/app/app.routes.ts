import { Route } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { ListComponent } from 'list';

export const appRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'list', // Define the path for the child route
        component: ListComponent, // Specify the component for the child route
      },
    ],
  },
];
