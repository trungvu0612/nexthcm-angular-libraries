import { TestBed } from '@angular/core/testing';

import { JobTitlesService } from './job-titles.service';

describe('JobTitlesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: JobTitlesService = TestBed.get(JobTitlesService);
    expect(service).toBeTruthy();
  });
});
