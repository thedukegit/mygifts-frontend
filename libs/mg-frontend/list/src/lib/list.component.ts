import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { Gift } from './gift.interface';
import { AddGiftDialogComponent } from './add-gift-dialog/add-gift-dialog.component';
import { GIFT_REPOSITORY } from './repositories/gift-repository.token';
import { IGiftRepository } from './repositories/gift-repository.interface';
import { LocalStorageGiftRepository } from './repositories/local-storage-gift.repository';

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
  providers: [
    { provide: GIFT_REPOSITORY, useClass: LocalStorageGiftRepository },
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  viewMode: 'list' | 'grid' = 'grid';
  protected gifts: Gift[] = [];

  private readonly giftRepository = inject<IGiftRepository>(GIFT_REPOSITORY);
  private readonly dialog = inject(MatDialog);

  async ngOnInit() {
    this.gifts = await this.giftRepository.getAll();
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
