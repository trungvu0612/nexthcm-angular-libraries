import { TestBed } from '@angular/core/testing';

import { AdminLeaveLevelApproveService } from './admin-leave-level-approve.service';

describe('LevelApproveService', () => {
  let service: AdminLeaveLevelApproveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminLeaveLevelApproveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
