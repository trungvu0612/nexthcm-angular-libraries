import { TestBed } from '@angular/core/testing';

import { MyTmeService } from './my-tme.service';

describe('MyTmeService', () => {
  let service: MyTmeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyTmeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
