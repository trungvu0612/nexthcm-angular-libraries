import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig, PagingResponse } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { AdminPolicy } from './models/policies';

@Injectable({
  providedIn: 'root',
})
export class AdminKnowledgeBaseService {
  appVersion = this.env.apiUrl + '/mytimeapp/v1.0';

  constructor(@Inject(APP_CONFIG) protected env: AppConfig, private httpClient: HttpClient) {}

  getPolicies(params: HttpParams): Observable<PagingResponse<AdminPolicy>> {
    return this.httpClient.get<PagingResponse<AdminPolicy>>(this.appVersion + '/policies', { params });
  }

  getPolicy(id: string): Observable<AdminPolicy> {
    return this.httpClient.get<AdminPolicy>(this.appVersion + '/policies' + '/' + id);
  }

  createPolicies(dto: AdminPolicy): Observable<AdminPolicy> {
    return this.httpClient.post<AdminPolicy>(this.appVersion + '/policies', dto);
  }

  editPolicies(dto: AdminPolicy, id: string): Observable<AdminPolicy> {
    return this.httpClient.put<AdminPolicy>(this.appVersion + `/policies/${id}`, dto);
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(this.appVersion + `/policies/${id}`, {});
  }
}
