import { TestBed } from '@angular/core/testing';

import { AdminEntitlementService } from './admin-entitlement.service';

describe('AdminEntitlementService', () => {
  let service: AdminEntitlementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminEntitlementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
