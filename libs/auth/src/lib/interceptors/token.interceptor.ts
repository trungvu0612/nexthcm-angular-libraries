import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, Provider } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError, throttleTime } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  private throttleLogout = new Subject();

  constructor(private cookieService: CookieService, private authService: AuthService) {
    this.throttleLogout.pipe(throttleTime(5000)).subscribe(() => {
      this.authService.logout();
    });
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({ setHeaders: { Authorization: `Bearer ${this.cookieService.get('access_token')}` } });
    return next.handle(request).pipe(
      catchError((response: HttpErrorResponse) => {
        if (response.status === 401) {
          this.throttleLogout.next();
        }
        return throwError(response);
      })
    );
  }
}

export const tokenInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptor,
  multi: true,
};
