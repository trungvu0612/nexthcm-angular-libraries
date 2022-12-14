import { Location } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, switchMap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly location: Location
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = this.authService.get('access_token');

    if (accessToken) {
      request = request.clone({ setHeaders: { Authorization: `Bearer ${accessToken}` } });
    }

    return next.handle(request).pipe(
      catchError((httpErrorResponse: HttpErrorResponse) => {
        if (httpErrorResponse.status === HttpStatusCode.Unauthorized) {
          return this.authService.refreshToken().pipe(
            catchError(() => {
              const returnUrl = this.location.path();
              this.authService.logout();
              this.router.navigate(['/login'], {
                queryParams: returnUrl && !returnUrl.startsWith('/login') ? { returnUrl } : null,
              });

              return throwError(httpErrorResponse);
            }),
            switchMap(() => this.intercept(request, next))
          );
        }

        return throwError(httpErrorResponse);
      })
    );
  }
}

export const TOKEN_INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptor,
  multi: true,
};
