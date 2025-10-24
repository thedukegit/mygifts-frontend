import { Injectable, Type } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DialogRef<T = any> {
  close(result?: T): void;
  cancel(): void;
}

interface ModalState<T = any> {
  component: Type<any> | null;
  inputs?: Record<string, any>;
  resolve?: (value: T) => void;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private readonly state$ = new BehaviorSubject<ModalState>({ component: null });
  readonly modal$ = this.state$.asObservable();

  /**
   * Opens a modal dialog with the specified component
   * @param component The component class to render in the modal
   * @param inputs Optional inputs to pass to the component
   * @returns Promise that resolves when the modal is closed
   */
  open<T = any>(component: Type<any>, inputs?: Record<string, any>): Promise<T> {
    return new Promise((resolve) => {
      this.state$.next({ component, inputs, resolve });
    });
  }

  close<T = any>(result?: T): void {
    const current = this.state$.getValue();
    if (current.resolve) {
      current.resolve(result);
    }
    this.state$.next({ component: null });
  }

  cancel(): void {
    const current = this.state$.getValue();
    if (current.resolve) {
      current.resolve(undefined);
    }
    this.state$.next({ component: null });
  }

  /**
   * Creates a DialogRef that can be injected into dialog components
   */
  createDialogRef<T = any>(): DialogRef<T> {
    return {
      close: (result?: T) => this.close(result),
      cancel: () => this.cancel()
    };
  }
}
