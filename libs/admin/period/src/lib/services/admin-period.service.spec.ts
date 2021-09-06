import { TestBed } from '@angular/core/testing';

import { AdminPeriodService } from './admin-period.service';

describe('AdminPeriodService', () => {
  let service: AdminPeriodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminPeriodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
