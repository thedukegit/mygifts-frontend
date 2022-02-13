import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { AuthComponent } from '@mygifts/desktop/auth';
import { LayoutComponent } from '@mygifts/desktop/shell/ui/layout';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', component: LayoutComponent, pathMatch: 'full' },
      { path: 'auth', component: AuthComponent, pathMatch: 'full' },
    ]),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
