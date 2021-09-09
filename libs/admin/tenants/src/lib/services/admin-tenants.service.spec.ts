import { TestBed } from '@angular/core/testing';

import { AdminTenantsService } from './admin-tenants.service';

describe('AdminTenantsService', () => {
  let service: AdminTenantsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminTenantsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
