import { TestBed } from '@angular/core/testing';

import { AdminEmployeeService } from './admin-employee.service';

describe('AdminEmployeeService', () => {
  let service: AdminEmployeeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminEmployeeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
