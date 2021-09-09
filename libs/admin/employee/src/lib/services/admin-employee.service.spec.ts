import { TestBed } from '@angular/core/testing';

import { AdminEmployeesService } from './admin-employees.service';

describe('AdminEmployeeService', () => {
  let service: AdminEmployeesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminEmployeesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
