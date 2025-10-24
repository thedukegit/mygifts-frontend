import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalService } from '@mg-frontend/ui';

@Component({
  selector: 'lib-add-friend-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './add-friend-dialog.component.html',
  styleUrl: './add-friend-dialog.component.scss',
})
export class AddFriendDialogComponent {
  private readonly modalService = inject(ModalService);
  private readonly fb = inject(FormBuilder);
  
  friendForm: FormGroup;

  constructor() {
    this.friendForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.friendForm.valid) {
      this.modalService.close(this.friendForm.value.email);
    }
  }

  onCancel(): void {
    this.modalService.cancel();
  }
}
