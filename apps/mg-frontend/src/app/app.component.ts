import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ModalHostComponent, ToastHostComponent } from '@mg-frontend/ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastHostComponent, ModalHostComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
