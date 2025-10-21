import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { MatBadgeModule } from '@angular/material/badge';
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
    MatBadgeModule,
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListComponent implements OnInit {
  protected viewMode: 'list' | 'grid' = 'grid';
  private readonly giftRepository: GiftRepository =
    inject<GiftRepository>(GIFT_REPOSITORY);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);
  private readonly route: ActivatedRoute = inject(ActivatedRoute);
  private readonly auth: Auth = inject(Auth);
  private readonly firestore: Firestore = inject(Firestore);

  private _gifts: Gift[] = [];
  protected currentFriendId: string | null = null;
  protected displayName: string = '';

  get gifts(): ReadonlyArray<Gift> {
    return this._gifts;
  }

  async ngOnInit(): Promise<void> {
    this.route.queryParamMap.subscribe(async (params) => {
      this.currentFriendId = params.get('friendId');
      await this.loadDisplayName();
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
        data: { mode: 'add' }
      }
    );

    dialogRef.afterClosed().subscribe(async (result: Gift | undefined) => {
      if (result) {
        await this.giftRepository.add(result);
        this._gifts = await this.giftRepository.getAll();
      }
    });
  }

  openEditGiftDialog(gift: Gift): void {
    const dialogRef: MatDialogRef<AddGiftDialogComponent> = this.dialog.open(
      AddGiftDialogComponent,
      {
        width: '500px',
        data: { gift, mode: 'edit' }
      }
    );

    dialogRef.afterClosed().subscribe(async (result: Gift | undefined) => {
      if (result && result.id) {
        await this.giftRepository.update(result.id, result);
        this._gifts = await this.giftRepository.getAll();
        this.snackBar.open('Gift updated successfully!', 'Close', { duration: 3000 });
      }
    });
  }

  async togglePurchased(gift: Gift): Promise<void> {
    if (!this.currentFriendId) {
      this.snackBar.open('You cannot mark your own gifts as purchased.', 'Close', { duration: 3000 });
      return;
    }

    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      this.snackBar.open('You must be logged in to mark gifts as purchased.', 'Close', { duration: 3000 });
      return;
    }

    // If gift is already purchased, only the person who purchased it can unmark it
    if (gift.purchased && gift.purchasedBy !== currentUser.uid) {
      this.snackBar.open('Only the person who marked this gift as purchased can unmark it.', 'Close', { duration: 3000 });
      return;
    }

    try {
      const isPurchased = !gift.purchased;
      
      // Get purchaser's name from Firestore
      let purchaserName = 'Unknown';
      if (isPurchased) {
        try {
          const userDoc = await getDoc(doc(this.firestore, 'users', currentUser.uid));
          const userData = userDoc.data() as any;
          if (userData) {
            purchaserName = `${userData.firstName} ${userData.lastName}`;
          }
        } catch {
          purchaserName = currentUser.email || 'Unknown';
        }
      }
      
      const updateData: Partial<Gift> = {
        purchased: isPurchased,
        purchasedBy: isPurchased ? currentUser.uid : undefined,
        purchasedByName: isPurchased ? purchaserName : undefined,
        purchasedAt: isPurchased ? new Date() : undefined,
      };

      await this.giftRepository.update(gift.id, updateData, this.currentFriendId || undefined);
      await this.loadGifts();

      const message = isPurchased
        ? 'Gift marked as purchased!'
        : 'Gift marked as not purchased.';
      this.snackBar.open(message, 'Close', { duration: 3000 });
    } catch (error) {
      this.snackBar.open('Failed to update gift.', 'Close', { duration: 3000 });
    }
  }

  canTogglePurchase(gift: Gift): boolean {
    const currentUser = this.auth.currentUser;
    if (!currentUser || !this.currentFriendId) {
      return false;
    }
    // If not purchased yet, anyone can mark it
    if (!gift.purchased) {
      return true;
    }
    // If already purchased, only the purchaser can unmark it
    return gift.purchasedBy === currentUser.uid;
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

  private async loadDisplayName(): Promise<void> {
    try {
      if (this.currentFriendId) {
        // Load friend's name
        const friendDoc = await getDoc(doc(this.firestore, 'users', this.currentFriendId));
        const friendData = friendDoc.data() as any;
        let friendName = 'Friend';
        if (friendData) {
          friendName = `${friendData.firstName} ${friendData.lastName}`;
        } 
        this.displayName = `${friendName}'s list`;
      } else {
        this.displayName = 'My List';
      }
    } catch {
      this.displayName = this.currentFriendId ? 'Friend' : 'My List';
    }
  }
}
