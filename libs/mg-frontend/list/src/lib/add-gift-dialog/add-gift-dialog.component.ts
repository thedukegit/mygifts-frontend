import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject, Input, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { ModalService } from '@mg-frontend/ui';
import { Gift } from '../gift.interface';
import { DefaultImageService } from '../services/default-image.service';

export interface GiftDialogData {
  gift?: Gift;
  mode: 'add' | 'edit';
}

@Component({
  selector: 'mg-add-gift-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './add-gift-dialog.component.html',
  styleUrls: ['./add-gift-dialog.component.scss'],
})
export class AddGiftDialogComponent implements OnInit {
  private readonly modalService = inject(ModalService);
  private readonly fb = inject(FormBuilder);
  
  giftForm!: FormGroup;
  @Input() mode: 'add' | 'edit' = 'add';
  @Input() gift?: Gift;
  private giftId?: string;

  ngOnInit(): void {
    const initial = this.gift || ({} as Gift);
    this.giftId = (initial as any).id;
    this.giftForm = this.fb.group({
      name: [initial?.name || '', Validators.required],
      description: [initial?.description || '', Validators.required],
      price: [initial?.price || '', [Validators.required, Validators.min(0)]],
      quantity: [initial?.quantity || 1, [Validators.required, Validators.min(1)]],
      imageUrl: [initial?.imageUrl || ''],
      link: [initial?.link || ''],
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
      this.modalService.close(result);
    }
  }

  onCancel(): void {
    this.modalService.cancel();
  }

  get imagePreviewUrl(): string {
    const url = this.giftForm.get('imageUrl')?.value;
    return DefaultImageService.ensureDefaultImage(url);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = DefaultImageService.ensureDefaultImage();
  }
}
