import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, Provider } from '@angular/core';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../app-config.token';
import { AppConfig } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ApiPrefixInterceptor implements HttpInterceptor {
  constructor(@Inject(APP_CONFIG) protected config: AppConfig) {}

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

export const API_PREFIX_INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ApiPrefixInterceptor,
  multi: true,
};
