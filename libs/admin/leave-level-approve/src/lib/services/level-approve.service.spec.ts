import { TestBed } from '@angular/core/testing';

import { LevelApproveService } from './level-approve.service';

describe('LevelApproveService', () => {
  let service: LevelApproveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LevelApproveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
