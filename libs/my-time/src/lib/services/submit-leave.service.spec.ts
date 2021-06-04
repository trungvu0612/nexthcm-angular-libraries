import { TestBed } from '@angular/core/testing';

import { SubmitLeaveService } from './submit-leave.service';

describe('SubmitLeaveService', () => {
  let service: SubmitLeaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubmitLeaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
