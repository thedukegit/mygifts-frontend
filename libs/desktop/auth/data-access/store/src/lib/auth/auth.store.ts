import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';

export interface AuthState {};

const initialState: AuthState = {};

@Injectable()
export class AuthStore extends ComponentStore<AuthState> {
  constructor() {
    super(initialState);
  }
}
