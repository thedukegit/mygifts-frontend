import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagsService {
  private readonly flags: Record<string, boolean> = {
    createAccount: false, // Feature flag for create account functionality
  };

  /**
   * Check if a feature flag is enabled
   * @param flagName The name of the feature flag
   * @returns true if the feature is enabled, false otherwise
   */
  isEnabled(flagName: string): boolean {
    return this.flags[flagName] === true;
  }

  /**
   * Enable a feature flag
   * @param flagName The name of the feature flag
   */
  enable(flagName: string): void {
    this.flags[flagName] = true;
  }

  /**
   * Disable a feature flag
   * @param flagName The name of the feature flag
   */
  disable(flagName: string): void {
    this.flags[flagName] = false;
  }
}

