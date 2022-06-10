import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';
import { SpinnerModule } from '@mygifts/desktop-shell-ui-spinner';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule,
    InputTextModule,
    ReactiveFormsModule,
    MessagesModule,
    SpinnerModule,
  ],
  declarations: [AuthComponent],
  exports: [AuthComponent],
})
export class AuthModule {}
