import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Environment, ENVIRONMENT } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthStore } from '../state/auth/auth-store';
import { AuthInfo, LoginPayload } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    @Inject(ENVIRONMENT) protected env: Environment,
    private httpClient: HttpClient,
    private authStore: AuthStore,
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
