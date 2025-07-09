import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ListComponentBusiness } from './list.component.business';
import { GiftRepository } from './repositories/gift-repository.interface';
import { GIFT_REPOSITORY } from './repositories/gift-repository.token';
import { IndexedDbGiftRepository } from './repositories/indexed-db-gift-repository';

@Component({
  selector: 'mg-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule,
    MatTooltipModule,
  ],
  providers: [{ provide: GIFT_REPOSITORY, useClass: IndexedDbGiftRepository }],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  private readonly giftRepository = inject<GiftRepository>(GIFT_REPOSITORY);
  private readonly dialog = inject(MatDialog);
  business: ListComponentBusiness;

  constructor() {
    this.business = new ListComponentBusiness(this.giftRepository, this.dialog);
  }

  async ngOnInit() {
    await this.business.init();
  }

  get viewMode() {
    return this.business.viewMode;
  }
  get sortedGifts() {
    return this.business.sortedGifts;
  }
  get sortBy() {
    return this.business.sortBy;
  }
  get sortDirection() {
    return this.business.sortDirection;
  }

  setSort(by: 'name' | 'price') {
    this.business.setSort(by);
  }

  toggleViewMode() {
    this.business.toggleViewMode();
  }

  openAddGiftDialog(): void {
    this.business.openAddGiftDialog();
  }
}
