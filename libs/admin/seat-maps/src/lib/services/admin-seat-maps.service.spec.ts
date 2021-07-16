import { TestBed } from '@angular/core/testing';

import { AdminSeatMapsService } from './admin-seat-maps.service';

describe('AdminSeatMapsService', () => {
  let service: AdminSeatMapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminSeatMapsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
