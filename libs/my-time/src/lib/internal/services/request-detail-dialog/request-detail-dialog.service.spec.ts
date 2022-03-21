import { TestBed } from '@angular/core/testing';

import { RequestDetailDialogService } from './request-detail-dialog.service';

describe('RequestDetailDialogService', () => {
  let service: RequestDetailDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestDetailDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
