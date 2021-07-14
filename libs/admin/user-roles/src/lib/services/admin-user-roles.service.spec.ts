import { TestBed } from '@angular/core/testing';

import { AdminUserRolesService } from './admin-user-roles.service';

describe('AdminUserRolesService', () => {
  let service: AdminUserRolesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminUserRolesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
