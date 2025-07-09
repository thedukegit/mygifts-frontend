import { MatDialog } from '@angular/material/dialog';
import { AddGiftDialogComponent } from './add-gift-dialog/add-gift-dialog.component';
import { Gift } from './gift.interface';
import { GiftRepository } from './repositories/gift-repository.interface';

export class ListComponentBusiness {
  viewMode: 'list' | 'grid' = 'grid';
  protected gifts: Gift[] = [];

  sortBy: 'name' | 'price' = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private giftRepository: GiftRepository,
    private dialog: MatDialog
  ) {}

  async init() {
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
