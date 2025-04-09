import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { Gift } from './gift.interface';
import { GiftRepository } from './gift.repository';
import { AddGiftDialogComponent } from './add-gift-dialog/add-gift-dialog.component';

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
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  viewMode: 'list' | 'grid' = 'grid';
  private readonly giftRepository = inject(GiftRepository);
  protected gifts: Gift[] = this.giftRepository.getAll();
  private readonly dialog = inject(MatDialog);

  toggleViewMode() {
    this.viewMode = this.viewMode === 'list' ? 'grid' : 'list';
  }

  openAddGiftDialog(): void {
    const dialogRef = this.dialog.open(AddGiftDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.giftRepository.add(result);
        this.gifts = this.giftRepository.getAll();
      }
    });
  }
}
