import { Route } from '@angular/router';
import { ListComponent } from '@mg-frontend/list';

export const appRoutes: Route[] = [
  {
    path: 'list', // Define the path for the ListComponent
    component: ListComponent, // Specify the ListComponent
  },
];
