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
import { Gift } from '../gift.interface';

@Component({
  selector: 'mg-add-gift-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-gift-dialog.component.html',
  styleUrls: ['./add-gift-dialog.component.scss'],
})
export class AddGiftDialogComponent {
  giftForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddGiftDialogComponent>,
    private fb: FormBuilder
  ) {
    this.giftForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      imageUrl: [''],
      link: [''],
    });
  }

  onSubmit(): void {
    if (this.giftForm.valid) {
      const gift: Omit<Gift, 'id'> = this.giftForm.value;
      this.dialogRef.close(gift);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
