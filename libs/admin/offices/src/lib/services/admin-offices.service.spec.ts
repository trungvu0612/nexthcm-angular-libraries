import { TestBed } from '@angular/core/testing';

import { AdminOfficesService } from './admin-offices.service';

describe('AdminOfficesService', () => {
  let service: AdminOfficesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminOfficesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
