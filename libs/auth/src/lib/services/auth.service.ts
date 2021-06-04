import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthInfo, LoginPayload } from '../models';
import { AuthStore } from '../state/auth/auth-store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    @Inject(APP_CONFIG) protected env: AppConfig,
    private httpClient: HttpClient,
    private authStore: AuthStore
  ) {}

  login(payload: LoginPayload): Observable<AuthInfo> {
    const params = new URLSearchParams();
    params.append('username', payload.username);
    params.append('password', payload.password);
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    return this.httpClient
      .post<AuthInfo>(this.env.apiUrl + '/accountapp/v1.0/auth', params.toString(), { headers })
      .pipe(tap((res) => this.authStore.login(res)));
  }

  logout(): void {
    this.authStore.logout();
  }
}
