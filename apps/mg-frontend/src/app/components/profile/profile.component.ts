import { AsyncPipe, CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { of, switchMap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MatCardModule, AsyncPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  readonly authService = inject(AuthService);
  readonly userService = inject(UserService);

  userDoc$ = this.authService.user$.pipe(
    switchMap(authUser => {
      if (authUser) {
        return this.userService.getCurrentUserDoc();
      }
      return of(undefined);
    })
  );
}


