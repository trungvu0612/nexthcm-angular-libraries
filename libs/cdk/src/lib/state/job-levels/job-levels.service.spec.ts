import { TestBed } from '@angular/core/testing';

import { JobLevelsService } from './job-levels.service';

describe('JobLevelsService', () => {
  let service: JobLevelsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobLevelsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
