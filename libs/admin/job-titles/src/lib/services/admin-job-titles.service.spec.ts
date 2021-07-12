import { TestBed } from '@angular/core/testing';

import { AdminJobTitlesService } from './admin-job-titles.service';

describe('AdminJobTitlesService', () => {
  let service: AdminJobTitlesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminJobTitlesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
