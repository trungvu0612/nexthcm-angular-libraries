import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig, PagingResponse } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { Policy } from './policies';

@Injectable({
  providedIn: 'root',
})
export class PoliciesService {
  appVersion = this.env.apiUrl + '/mytimeapp/v1.0';

  constructor(@Inject(APP_CONFIG) protected env: AppConfig, private httpClient: HttpClient) {}

  getPolicies(params: HttpParams): Observable<PagingResponse<Policy>> {
    return this.httpClient.get<PagingResponse<Policy>>(this.appVersion + '/policies', { params });
  }

  getPolicy(id: string): Observable<Policy> {
    return this.httpClient.get<Policy>(this.appVersion + '/policies' + '/' + id);
  }

  createPolicies(dto: Policy): Observable<Policy> {
    return this.httpClient.post<Policy>(this.appVersion + '/policies', dto);
  }

  editPolicies(dto: Policy, id: string): Observable<Policy> {
    return this.httpClient.put<Policy>(this.appVersion + `/policies/${id}`, dto);
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(this.appVersion + `/policies/${id}`, {});
  }
}
