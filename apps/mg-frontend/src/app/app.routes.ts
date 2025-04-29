import { Route } from '@angular/router';
import { ListComponent } from '@mg-frontend/list';
import { FriendsComponent } from '@mg-frontend/friends';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/list',
    pathMatch: 'full',
  },
  {
    path: 'list', // Define the path for the ListComponent
    component: ListComponent, // Specify the ListComponent
  },
  {
    path: 'friends',
    component: FriendsComponent,
  },
];
