import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'lib-delete-confirmation-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Delete Friend</h2>
    <div mat-dialog-content>
      <p>Are you sure you want to delete this friend?</p>
      <p>This action cannot be undone.</p>
    </div>
    <div align="end" mat-dialog-actions>
      <button (click)="onCancel()" mat-button>Cancel</button>
      <button (click)="onConfirm()" color="warn" mat-raised-button>
        Delete
      </button>
    </div>
  `,
})
export class DeleteConfirmationDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
