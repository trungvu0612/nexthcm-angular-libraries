import { TestBed } from '@angular/core/testing';

import { AdminPermissionsService } from './admin-permissions.service';

describe('AdminPermissionsService', () => {
  let service: AdminPermissionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminPermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
