import { TestBed } from '@angular/core/testing';

import { LeaveTypesService } from './leave-types.service';

describe('LeaveTypesService', () => {
  let service: LeaveTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeaveTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
