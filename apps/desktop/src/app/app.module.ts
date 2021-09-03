import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { GiftsComponent } from '../../../../libs/desktop/gifts/src/lib/gifts/gifts.component';
import { GiftComponent } from '../../../../libs/desktop/gifts/src/lib/gift/gift.component';

@NgModule({
  declarations: [AppComponent, GiftsComponent, GiftComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
