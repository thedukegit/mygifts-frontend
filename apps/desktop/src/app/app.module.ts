import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent, AuthGuard } from '@mygifts/desktop-auth-feature-auth';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from '@mygifts/desktop/home';
import { GiftsComponent } from '@mygifts/desktop/gifts/feature-gifts';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/gifts',
    pathMatch: 'full',
  },
  {
    path: 'gifts',
    component: GiftsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'home',
    children: [
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full',
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: 'auth',
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
      },
      {
        path: 'login',
        redirectTo: 'AuthComponent',
      },
    ],
    component: AuthComponent,
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpClientModule, RouterModule.forRoot(appRoutes)],
  bootstrap: [AppComponent],
})
export class AppModule {}
