import { TestBed } from '@angular/core/testing';

import { SeatMapsService } from './seat-maps.service';

describe('SeatMapsService', () => {
  let service: SeatMapsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeatMapsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
