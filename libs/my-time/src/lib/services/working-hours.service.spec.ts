import { TestBed } from '@angular/core/testing';

import { MyTimeService } from './my-time.service';

describe('WorkingHourService', () => {
  let service: MyTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
