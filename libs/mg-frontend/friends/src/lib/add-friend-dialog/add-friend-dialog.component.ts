import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
  templateUrl: './add-friend-dialog.component.html',
  styleUrl: './add-friend-dialog.component.scss',
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
