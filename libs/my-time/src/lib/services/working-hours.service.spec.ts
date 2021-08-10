import { TestBed } from '@angular/core/testing';

import { WorkingHoursService } from './working-hours.service';

describe('WorkingHourService', () => {
  let service: WorkingHoursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkingHoursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
