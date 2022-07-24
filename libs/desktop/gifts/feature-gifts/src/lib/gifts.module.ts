import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GiftsComponent } from './gifts/gifts.component';
import { GiftComponent } from './gift/gift.component';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { RatingModule } from 'primeng/rating';
import { DataViewModule } from 'primeng/dataview';
import { DropdownModule } from 'primeng/dropdown';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    ReactiveFormsModule,
    InputTextModule,
    FormsModule,
    ListboxModule,
    RatingModule,
    DataViewModule,
    DropdownModule,
    PickListModule,
    OrderListModule,
    ScrollPanelModule,
  ],
  declarations: [GiftsComponent, GiftComponent],
  exports: [GiftsComponent],
})
export class GiftsModule {}
