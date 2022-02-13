import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from './auth.component';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { MessagesModule } from 'primeng/messages';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    RouterModule,
    InputTextModule,
    ReactiveFormsModule,
    MessagesModule,
  ],
  declarations: [AuthComponent],
  exports: [AuthComponent],
})
export class AuthModule {}
