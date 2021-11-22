import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiftsComponent } from './gifts/gifts.component';
import { GiftComponent } from './gift/gift.component';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
  imports: [CommonModule, ButtonModule, ReactiveFormsModule, InputTextModule, FormsModule],
  declarations: [GiftsComponent, GiftComponent],
  exports: [GiftsComponent]
})
export class GiftsModule {
}
