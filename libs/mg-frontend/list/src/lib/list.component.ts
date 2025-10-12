import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { AddGiftDialogComponent } from './add-gift-dialog/add-gift-dialog.component';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import { GiftRepository } from './gift-repository.interface';
import { GIFT_REPOSITORY } from './gift-repository.token';
import { Gift } from './gift.interface';

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
export class ListComponent implements OnInit {
  protected viewMode: 'list' | 'grid' = 'grid';
  private readonly giftRepository: GiftRepository =
    inject<GiftRepository>(GIFT_REPOSITORY);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);

  private _gifts: Gift[] = [];
  protected currentFriendId: string | null = null;

  get gifts(): ReadonlyArray<Gift> {
    return this._gifts;
  }

  async ngOnInit(): Promise<void> {
    this.route.queryParamMap.subscribe(async (params) => {
      this.currentFriendId = params.get('friendId');
      await this.loadGifts();
    });
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'list' ? 'grid' : 'list';
  }

  openAddGiftDialog(): void {
    const dialogRef: MatDialogRef<AddGiftDialogComponent> = this.dialog.open(
      AddGiftDialogComponent,
      {
        width: '500px',
      }
    );

    dialogRef.afterClosed().subscribe(async (result: Gift | undefined) => {
      if (result) {
        await this.giftRepository.add(result);
        this._gifts = await this.giftRepository.getAll();
      }
    });
  }

  async deleteGift(id: string): Promise<void> {
    if (this.currentFriendId) {
      this.snackBar.open('You cannot delete gifts from another user\'s list.', 'Close', { duration: 3000 });
      return;
    }
    const dialogRef: MatDialogRef<DeleteConfirmationDialogComponent> =
      this.dialog.open(DeleteConfirmationDialogComponent, {
        width: '400px',
      });

    dialogRef.afterClosed().subscribe(async (confirmed: boolean) => {
      if (confirmed) {
        await this.giftRepository.delete(id);
        this._gifts = await this.giftRepository.getAll();
      }
    });
  }

  private async loadGifts(): Promise<void> {
    try {
      if (this.currentFriendId && this.giftRepository.getByUserId) {
        this._gifts = await this.giftRepository.getByUserId(this.currentFriendId);
      } else {
        this._gifts = await this.giftRepository.getAll();
      }
    } catch {
      this.snackBar.open('Failed to load gifts', 'Close', { duration: 3000 });
    }
  }
}
