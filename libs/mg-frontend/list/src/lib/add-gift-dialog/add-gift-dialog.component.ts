import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Gift } from '../gift.interface';

export interface GiftDialogData {
  gift?: Gift;
  mode: 'add' | 'edit';
}

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
  mode: 'add' | 'edit';
  giftId?: string;

  constructor(
    private dialogRef: MatDialogRef<AddGiftDialogComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data?: GiftDialogData
  ) {
    this.mode = data?.mode || 'add';
    this.giftId = data?.gift?.id;

    this.giftForm = this.fb.group({
      name: [data?.gift?.name || '', Validators.required],
      description: [data?.gift?.description || '', Validators.required],
      price: [data?.gift?.price || '', [Validators.required, Validators.min(0)]],
      imageUrl: [data?.gift?.imageUrl || ''],
      link: [data?.gift?.link || ''],
    });
  }

  get dialogTitle(): string {
    return this.mode === 'edit' ? 'Edit Gift' : 'Add New Gift';
  }

  get submitButtonText(): string {
    return this.mode === 'edit' ? 'Update Gift' : 'Add Gift';
  }

  onSubmit(): void {
    if (this.giftForm.valid) {
      const giftData = this.giftForm.value;
      const result = this.mode === 'edit' 
        ? { ...giftData, id: this.giftId }
        : giftData;
      this.dialogRef.close(result);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
