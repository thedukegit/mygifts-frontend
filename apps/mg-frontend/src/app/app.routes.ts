import { Route } from '@angular/router';
import { FriendsComponent } from '@mg-frontend/friends';
import { ListComponent } from '@mg-frontend/list';
import { LoginComponent } from './components/login/login.component';
import { ShellComponent } from './components/shell/shell.component';
import { AuthGuard } from './guards/auth.guard';

export const appRoutes: Route[] = [
  {
    path: '',
    component: ShellComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'list',
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
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];
