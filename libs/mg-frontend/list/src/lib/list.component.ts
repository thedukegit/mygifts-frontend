import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { ModalService, ToastService } from '@mg-frontend/ui';
import { AddGiftDialogComponent } from './add-gift-dialog/add-gift-dialog.component';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import { GiftRepository } from './gift-repository.interface';
import { GIFT_REPOSITORY } from './gift-repository.token';
import { Gift } from './gift.interface';

@Component({
  selector: 'mg-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ListComponent implements OnInit {
  protected viewMode: 'list' | 'grid' = 'grid';
  private readonly giftRepository: GiftRepository =
    inject<GiftRepository>(GIFT_REPOSITORY);
  private readonly modal = inject(ModalService);
  private readonly toast: ToastService = inject(ToastService);
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

  async openAddGiftDialog(): Promise<void> {
    const result = await this.modal.open<Gift>(AddGiftDialogComponent, { mode: 'add' });
    if (result) {
      await this.giftRepository.add(result);
      this._gifts = await this.giftRepository.getAll();
    }
  }

  async openEditGiftDialog(gift: Gift): Promise<void> {
    const result = await this.modal.open<Gift & { id: string }>(AddGiftDialogComponent, { 
      mode: 'edit', 
      gift 
    });
    if (result && result.id) {
      await this.giftRepository.update(result.id, result);
      this._gifts = await this.giftRepository.getAll();
      this.toast.show('Gift updated successfully!', 'success');
    }
  }

  async togglePurchased(gift: Gift): Promise<void> {
    if (!this.currentFriendId) {
      this.toast.show('You cannot mark your own gifts as purchased.', 'error');
      return;
    }

    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      this.toast.show('You must be logged in to mark gifts as purchased.', 'error');
      return;
    }

    // If gift is already purchased, only the person who purchased it can unmark it
    if (gift.purchased && gift.purchasedBy !== currentUser.uid) {
      this.toast.show('Only the person who marked this gift as purchased can unmark it.', 'error');
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
      this.toast.show(message, 'success');
    } catch (error) {
      this.toast.show('Failed to update gift.', 'error');
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
      this.toast.show('You cannot delete gifts from another user\'s list.', 'error');
      return;
    }
    const confirmed = await this.modal.open<boolean>(DeleteConfirmationDialogComponent);
    if (confirmed) {
      await this.giftRepository.delete(id);
      this._gifts = await this.giftRepository.getAll();
    }
  }

  private async loadGifts(): Promise<void> {
    try {
      if (this.currentFriendId && this.giftRepository.getByUserId) {
        this._gifts = await this.giftRepository.getByUserId(this.currentFriendId);
      } else {
        this._gifts = await this.giftRepository.getAll();
      }
    } catch {
      this.toast.show('Failed to load gifts', 'error');
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
