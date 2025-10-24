# UI Library

This library contains shared UI components and services for modal dialogs and toast notifications.

## Modal System

The modal system uses **dynamic component loading**, making it fully scalable for any number of dialogs.

### Architecture Benefits

✅ **Scalable**: Add unlimited dialogs without modifying the modal-host component  
✅ **Decoupled**: Modal-host doesn't know about specific dialog components  
✅ **Type-safe**: Full TypeScript support with generics  
✅ **Simple API**: Clean, Promise-based interface  

### How to Use

#### 1. Create Your Dialog Component

Any standalone component can be a dialog. Just inject `ModalService` to close/cancel:

```typescript
import { Component, inject, Input } from '@angular/core';
import { ModalService } from '@mg-frontend/ui';

@Component({
  selector: 'app-my-dialog',
  standalone: true,
  template: `
    <div class="p-6">
      <h2>{{ title }}</h2>
      <button (click)="onConfirm()">Confirm</button>
      <button (click)="onCancel()">Cancel</button>
    </div>
  `
})
export class MyDialogComponent {
  private readonly modalService = inject(ModalService);
  
  @Input() title = 'Dialog';
  @Input() data?: any;

  onConfirm() {
    this.modalService.close({ confirmed: true, data: this.data });
  }

  onCancel() {
    this.modalService.cancel();
  }
}
```

#### 2. Open the Dialog

From any component, import the dialog component class and open it:

```typescript
import { Component, inject } from '@angular/core';
import { ModalService } from '@mg-frontend/ui';
import { MyDialogComponent } from './my-dialog.component';

@Component({...})
export class MyFeatureComponent {
  private modal = inject(ModalService);

  async showDialog() {
    const result = await this.modal.open<{ confirmed: boolean }>(
      MyDialogComponent,
      { title: 'Custom Title', data: { foo: 'bar' } }
    );

    if (result?.confirmed) {
      console.log('User confirmed!');
    }
  }
}
```

### Key Points

- **No registration needed**: Just import the component class where you use it
- **Input binding**: Pass data via the `inputs` parameter (uses Angular's `setInput`)
- **Type-safe results**: Use generics to type the return value
- **No event emitters needed**: Dialog components call `modalService.close(result)` directly

### Examples in Codebase

- `AddGiftDialogComponent` - Form dialog with inputs
- `AddFriendDialogComponent` - Simple form dialog
- `DeleteConfirmationDialogComponent` - Confirmation dialog

## Toast Notifications

Simple toast notification service for success/error/info messages.

### Usage

```typescript
import { Component, inject } from '@angular/core';
import { ToastService } from '@mg-frontend/ui';

@Component({...})
export class MyComponent {
  private toast = inject(ToastService);

  showNotification() {
    this.toast.show('Operation successful!', 'success');
    this.toast.show('Something went wrong', 'error', 5000); // 5 second duration
  }
}
```

### API

- `show(message: string, type: 'success' | 'error' | 'info', durationMs = 3000)`
- `dismiss(id: number)` - Dismiss specific toast
- `clear()` - Clear all toasts
