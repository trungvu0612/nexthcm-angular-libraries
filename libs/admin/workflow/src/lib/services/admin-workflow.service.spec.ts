import { TestBed } from '@angular/core/testing';

import { AdminWorkflowsService } from './admin-workflows.service';

describe('AdminWorkflowService', () => {
  let service: AdminWorkflowsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminWorkflowsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
