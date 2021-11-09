import { TestBed } from '@angular/core/testing';

import { BlobErrorHttpInterceptor } from './blob-error-http.interceptor';

describe('BlobErrorHttpInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [BlobErrorHttpInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor: BlobErrorHttpInterceptor = TestBed.inject(BlobErrorHttpInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
