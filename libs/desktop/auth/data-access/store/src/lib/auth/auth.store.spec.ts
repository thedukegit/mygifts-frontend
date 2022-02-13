import { AuthStore } from './auth.store';

describe('AuthStore', () => {
  const componentStore = new AuthStore();

  it('should be created', () => {
    expect(componentStore).toBeTruthy();
  });
});
