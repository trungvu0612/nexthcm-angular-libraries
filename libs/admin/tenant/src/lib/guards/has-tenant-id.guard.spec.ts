import { TestBed } from '@angular/core/testing';

import { HasTenantIdGuard } from './has-tenant-id.guard';

describe('HasTenantIdGuard', () => {
  let guard: HasTenantIdGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HasTenantIdGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
