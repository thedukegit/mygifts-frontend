import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'lib-add-friend-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  template: `
    <h2 mat-dialog-title>Add New Friend</h2>
    <form (ngSubmit)="onSubmit()" [formGroup]="friendForm">
      <div mat-dialog-content>
        <mat-form-field appearance="fill">
          <mat-label>Email</mat-label>
          <input formControlName="email" matInput required type="email" />
        </mat-form-field>
      </div>

      <div align="end" mat-dialog-actions>
        <button (click)="onCancel()" mat-button>Cancel</button>
        <button
          [disabled]="!friendForm.valid"
          color="primary"
          mat-raised-button
          type="submit"
        >
          Add Friend
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      mat-form-field {
        width: 100%;
        margin-bottom: 16px;
      }
    `,
  ],
})
export class AddFriendDialogComponent {
  friendForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddFriendDialogComponent>,
    private fb: FormBuilder
  ) {
    this.friendForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.friendForm.valid) {
      this.dialogRef.close(this.friendForm.value.email);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
