import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { ToastService } from '../services/toast.service';

@Component({
  selector: 'mg-toast-host',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="fixed inset-0 z-[100] pointer-events-none">
      <div class="absolute right-4 bottom-4 flex max-w-sm flex-col gap-2">
        @for (t of toastService.toasts$ | async; track t.id) {
          <div class="pointer-events-auto rounded-lg border border-border bg-card p-3 shadow-lg"
               [ngClass]="{
                 'border-green-600': t.type === 'success',
                 'border-red-600': t.type === 'error',
                 'border-primary': t.type === 'info'
               }">
            <div class="flex items-start gap-2">
              <div class="mt-0.5" [ngClass]="{
                 'text-green-600': t.type === 'success',
                 'text-red-600': t.type === 'error',
                 'text-primary': t.type === 'info'
               }">
                <iconify-icon [icon]="t.type === 'success' ? 'heroicons:check-circle' : t.type === 'error' ? 'heroicons:exclamation-triangle' : 'heroicons:information-circle'" class="text-lg"></iconify-icon>
              </div>
              <div class="text-sm">{{ t.message }}</div>
              <button class="ml-auto icon-btn" (click)="toastService.dismiss(t.id)">
                <iconify-icon icon="heroicons:x-mark" class="text-lg"></iconify-icon>
              </button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class ToastHostComponent {
  readonly toastService = inject(ToastService);
}

