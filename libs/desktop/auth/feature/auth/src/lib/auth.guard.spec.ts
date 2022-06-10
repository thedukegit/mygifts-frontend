import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

describe('AuthGuard', () => {
  let guard: AuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return false when user is not authenticated', () => {
    // arrange

    // act
    const canActivate = guard.canActivate(
      fakeActivatedRoute(),
      fakeRouterState('/')
    );

    // assert
    // expect(canActivateSpy).toBeCalled();
    expect(canActivate).toBe(false);
  });
});

function fakeActivatedRoute(): ActivatedRouteSnapshot {
  return {} as ActivatedRouteSnapshot;
}

function fakeRouterState(url: string): RouterStateSnapshot {
  return {
    url,
  } as RouterStateSnapshot;
}
