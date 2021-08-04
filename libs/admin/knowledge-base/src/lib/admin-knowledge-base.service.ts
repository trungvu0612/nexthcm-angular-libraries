import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagingResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { AdminPolicy } from './models/policies';

@Injectable({
  providedIn: 'root',
})
export class AdminKnowledgeBaseService {
  appVersion = '/mytimeapp/v1.0';

  constructor(private httpClient: HttpClient) {}

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
