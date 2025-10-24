import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService, ToastService } from '@mg-frontend/ui';
import { AddFriendDialogComponent } from './add-friend-dialog/add-friend-dialog.component';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import { FriendRepository } from './friend-repository.interface';
import { FRIEND_REPOSITORY } from './friend-repository.token';
import { Friend } from './friend.interface';

@Component({
  selector: 'lib-friends',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FriendsComponent implements OnInit {
  private readonly friendRepository: FriendRepository =
    inject<FriendRepository>(FRIEND_REPOSITORY);
  private readonly modal = inject(ModalService);
  private readonly toast: ToastService = inject(ToastService);
  private readonly router: Router = inject(Router);

  private _friends: Friend[] = [];

  public get friends(): Array<Friend> {
    return this._friends;
  }

  async ngOnInit(): Promise<void> {
    await this.loadFriends();
  }

  async openAddFriendDialog(): Promise<void> {
    const email = await this.modal.open<string>(AddFriendDialogComponent);
    if (email) {
      try {
        await this.friendRepository.add(email);
        await this.loadFriends();
        this.toast.show('Friend added successfully', 'success');
      } catch (e: unknown) {
        const message = (e as Error)?.message === 'FRIEND_NOT_FOUND'
          ? 'No user found with that email'
          : (e as Error)?.message === 'CANNOT_ADD_SELF'
            ? 'You cannot add yourself as a friend'
            : 'Failed to add friend';
        this.toast.show(message, 'error');
      }
    }
  }

  async deleteFriend(friend: Friend): Promise<void> {
    const confirmed = await this.modal.open<boolean>(DeleteConfirmationDialogComponent);
    if (confirmed) {
      try {
        await this.friendRepository.delete(friend.id);
        await this.loadFriends();
        this.toast.show('Friend removed successfully', 'success');
      } catch {
        this.toast.show('Failed to remove friend', 'error');
      }
    }
  }

  async viewGifts(friend: Friend): Promise<void> {
    await this.router.navigate(['/list'], {
      queryParams: { friendId: friend.id },
    });
  }

  private async loadFriends(): Promise<void> {
    try {
      this._friends = await this.friendRepository.getAll();
    } catch {
      this.toast.show('Failed to load friends', 'error');
    }
  }
}
