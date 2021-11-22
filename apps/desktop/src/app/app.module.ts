import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GiftsModule } from '@mygifts/desktop/gifts/feature-gifts';

@NgModule({
  declarations: [AppComponent, ],
  imports: [BrowserModule, GiftsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
