import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddGiftDialogComponent } from './add-gift-dialog/add-gift-dialog.component';
import { Gift } from './gift.interface';
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
  viewMode: 'list' | 'grid' = 'grid';
  protected gifts: Gift[] = [];

  sortBy: 'name' | 'price' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  private readonly giftRepository = inject<GiftRepository>(GIFT_REPOSITORY);
  private readonly dialog = inject(MatDialog);

  async ngOnInit() {
    this.gifts = await this.giftRepository.getAll();
  }

  get sortedGifts(): Gift[] {
    return [...this.gifts].sort((a, b) => {
      let compare = 0;
      if (this.sortBy === 'name') {
        compare = a.name.localeCompare(b.name);
      } else if (this.sortBy === 'price') {
        compare = a.price - b.price;
      }
      return this.sortDirection === 'asc' ? compare : -compare;
    });
  }

  setSort(by: 'name' | 'price') {
    if (this.sortBy === by) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = by;
      this.sortDirection = 'asc';
    }
  }

  toggleViewMode() {
    this.viewMode = this.viewMode === 'list' ? 'grid' : 'list';
  }

  openAddGiftDialog(): void {
    const dialogRef = this.dialog.open(AddGiftDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        await this.giftRepository.add(result);
        this.gifts = await this.giftRepository.getAll();
      }
    });
  }
}
