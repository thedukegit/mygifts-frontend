import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ModalService } from '@mg-frontend/ui';

@Component({
  selector: 'lib-delete-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-confirmation-dialog.component.html',
})
export class DeleteConfirmationDialogComponent {
  private readonly modalService = inject(ModalService);

  onConfirm(): void {
    this.modalService.close(true);
  }

  onCancel(): void {
    this.modalService.close(false);
  }
}
