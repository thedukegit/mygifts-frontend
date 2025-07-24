import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { AddFriendDialogComponent } from './add-friend-dialog/add-friend-dialog.component';
import { DeleteConfirmationDialogComponent } from './delete-confirmation-dialog/delete-confirmation-dialog.component';
import { FriendRepository } from './friend-repository.interface';
import { FRIEND_REPOSITORY } from './friend-repository.token';
import { Friend } from './friend.interface';

@Component({
  selector: 'lib-friends',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltip,
  ],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.scss',
})
export class FriendsComponent implements OnInit {
  private readonly friendRepository: FriendRepository =
    inject<FriendRepository>(FRIEND_REPOSITORY);
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);
  private readonly router: Router = inject(Router);

  private _friends: Friend[] = [];

  public get friends(): Array<Friend> {
    return this._friends;
  }

  async ngOnInit(): Promise<void> {
    await this.loadFriends();
  }

  openAddFriendDialog(): void {
    const dialogRef: MatDialogRef<AddFriendDialogComponent> = this.dialog.open(
      AddFriendDialogComponent,
      {
        width: '400px',
      }
    );

    dialogRef.afterClosed().subscribe(async (email: string | undefined) => {
      if (email) {
        try {
          await this.friendRepository.add(email);
          await this.loadFriends();
          this.snackBar.open('Friend added successfully', 'Close', {
            duration: 3000,
          });
        } catch (error) {
          this.snackBar.open('Failed to add friend', 'Close', {
            duration: 3000,
          });
        }
      }
    });
  }

  async deleteFriend(friend: Friend): Promise<void> {
    const dialogRef: MatDialogRef<DeleteConfirmationDialogComponent> =
      this.dialog.open(DeleteConfirmationDialogComponent, {
        width: '400px',
      });

    dialogRef.afterClosed().subscribe(async (confirmed: boolean) => {
      if (confirmed) {
        try {
          await this.friendRepository.delete(friend.id);
          await this.loadFriends();
          this.snackBar.open('Friend removed successfully', 'Close', {
            duration: 3000,
          });
        } catch (error) {
          this.snackBar.open('Failed to remove friend', 'Close', {
            duration: 3000,
          });
        }
      }
    });
  }

  async viewGifts(friend: Friend): Promise<void> {
    try {
      await this.friendRepository.getFriendGifts(friend.id);
      await this.router.navigate(['/gifts'], {
        queryParams: { friendId: friend.id },
      });
    } catch (error) {
      this.snackBar.open("Failed to load friend's gifts", 'Close', {
        duration: 3000,
      });
    }
  }

  private async loadFriends(): Promise<void> {
    try {
      this._friends = await this.friendRepository.getAll();
    } catch (error) {
      this.snackBar.open('Failed to load friends', 'Close', { duration: 3000 });
    }
  }
}
