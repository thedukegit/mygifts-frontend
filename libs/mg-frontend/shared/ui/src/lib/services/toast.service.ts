import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  private readonly toastsSubject = new BehaviorSubject<Toast[]>([]);
  readonly toasts$ = this.toastsSubject.asObservable();

  show(message: string, type: ToastType = 'info', durationMs = 3000): void {
    const toast: Toast = { id: this.nextId++, message, type };
    const current = this.toastsSubject.getValue();
    this.toastsSubject.next([...current, toast]);
    if (durationMs > 0) {
      window.setTimeout(() => this.dismiss(toast.id), durationMs);
    }
  }

  dismiss(id: number): void {
    const remaining = this.toastsSubject.getValue().filter(t => t.id !== id);
    this.toastsSubject.next(remaining);
  }

  clear(): void {
    this.toastsSubject.next([]);
  }
}

