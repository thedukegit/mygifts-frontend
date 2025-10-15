import { Route } from '@angular/router';
import { FriendsComponent } from '@mg-frontend/friends';
import { ListComponent } from '@mg-frontend/list';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ShellComponent } from './components/shell/shell.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
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
        data: { title: 'List' },
      },
      {
        path: 'friends',
        component: FriendsComponent,
        data: { title: 'Friends' },
      },
      {
        path: 'profile',
        component: ProfileComponent,
        data: { title: 'Profile' },
      },
      {
        path: 'settings',
        component: SettingsComponent,
        data: { title: 'Settings' },
      },
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'verify-email',
    component: VerifyEmailComponent,
  },
];
