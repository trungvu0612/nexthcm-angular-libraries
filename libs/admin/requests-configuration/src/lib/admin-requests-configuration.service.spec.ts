import { TestBed } from '@angular/core/testing';

import { AdminRequestsConfigurationService } from './admin-requests-configuration.service';

describe('AdminRequestsConfigurationService', () => {
  let service: AdminRequestsConfigurationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminRequestsConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
