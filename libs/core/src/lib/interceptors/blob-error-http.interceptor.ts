import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';
import { from, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class BlobErrorHttpInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        return request.responseType === 'blob' && err.error instanceof Blob
          ? from(
              Promise.resolve(err).then(async ({ error, headers, status, statusText, url }) => {
                throw new HttpErrorResponse({
                  error: JSON.parse(await error.text()),
                  headers,
                  status,
                  statusText,
                  url: url ?? undefined,
                });
              })
            )
          : throwError(err);
      })
    );
  }
}

export const BLOB_ERROR_HTTP_INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: BlobErrorHttpInterceptor,
  multi: true,
};
