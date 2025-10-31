import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { FeatureFlagsService } from '../services/feature-flags.service';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagGuard implements CanActivate {
  private readonly featureFlagsService = inject(FeatureFlagsService);
  private readonly router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const featureFlag = route.data?.['featureFlag'];
    
    if (featureFlag && !this.featureFlagsService.isEnabled(featureFlag)) {
      // Redirect to login if feature is disabled
      this.router.navigate(['/login']);
      return false;
    }
    
    return true;
  }
}

