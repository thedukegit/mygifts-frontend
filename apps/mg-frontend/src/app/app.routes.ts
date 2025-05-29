import { Route } from '@angular/router';
import { FriendsComponent } from '@mg-frontend/friends';
import { ListComponent } from '@mg-frontend/list';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: '/list',
    pathMatch: 'full',
  },
  {
    path: 'list',
    component: ListComponent,
  },
  {
    path: 'friends',
    component: FriendsComponent,
  },
];
