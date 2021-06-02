import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, Provider } from '@angular/core';
import { Observable } from 'rxjs';
import { ENVIRONMENT } from '../core.config';
import { Environment } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ApiPrefixInterceptor implements HttpInterceptor {
  constructor(@Inject(ENVIRONMENT) protected config: Environment) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (
      !/^(http|https):/i.test(request.url) &&
      !request.url.startsWith('assets/') &&
      !request.url.startsWith('auth/')
    ) {
      request = request.clone({ url: this.config.apiUrl + request.url });
    }
    return next.handle(request);
  }
}

export const apiPrefixInterceptorProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ApiPrefixInterceptor,
  multi: true,
};
