import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ModalService } from '@mg-frontend/ui';

@Component({
  selector: 'mg-delete-confirmation-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.scss'],
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
