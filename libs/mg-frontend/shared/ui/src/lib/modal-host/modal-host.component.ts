import { AsyncPipe, CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  inject,
  OnDestroy,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ModalService } from '../services/modal.service';

@Component({
  selector: 'lib-modal-host',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, AsyncPipe],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4"
         [class.hidden]="!(modalService.modal$ | async)?.component">
      <div class="absolute inset-0 bg-black/40" (click)="modalService.cancel()"></div>
      <div class="relative z-10 max-h-[90vh] overflow-y-auto">
        <ng-container #dialogContainer></ng-container>
      </div>
    </div>
  `,
})
export class ModalHostComponent implements AfterViewInit, OnDestroy {
  readonly modalService = inject(ModalService);
  @ViewChild('dialogContainer', { read: ViewContainerRef, static: true })
  dialogContainer!: ViewContainerRef;
  private subscription?: Subscription;

  ngAfterViewInit(): void {
    this.subscription = this.modalService.modal$.subscribe(state => {
      if (this.dialogContainer) {
        this.dialogContainer.clear();

        if (state.component) {
          const componentRef = this.dialogContainer.createComponent(state.component);

          // Set inputs if provided
          if (state.inputs) {
            Object.entries(state.inputs).forEach(([key, value]) => {
              componentRef.setInput(key, value);
            });
          }

          componentRef.changeDetectorRef.detectChanges();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
