import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromGifts from './+state/gifts.reducer';
import { MygiftsDesktopGiftsEffects } from './+state/gifts.effects';
import { MygiftsDesktopGiftsFacade } from './+state/gifts.facade';

@NgModule({
  imports: [
    CommonModule,

    RouterModule.forChild([
      /* {path: '', pathMatch: 'full', component: InsertYourComponentHere} */
    ]),

    StoreModule.forFeature(fromGifts.GIFTS_FEATURE_KEY, fromGifts.reducer),

    EffectsModule.forFeature([MygiftsDesktopGiftsEffects]),
  ],
  providers: [MygiftsDesktopGiftsFacade],
})
export class MygiftsDesktopGiftsModule {}
