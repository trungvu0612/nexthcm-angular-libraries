import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MY_TIME_API_PATH, PagingResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { AdminPolicy } from './models/policies';

@Injectable({
  providedIn: 'root',
})
export class AdminKnowledgeBaseService {
  constructor(private httpClient: HttpClient) {}

  getPolicies(params: HttpParams): Observable<PagingResponse<AdminPolicy>> {
    return this.httpClient.get<PagingResponse<AdminPolicy>>(`${MY_TIME_API_PATH}/policies`, { params });
  }

  getPolicy(id: string): Observable<AdminPolicy> {
    return this.httpClient.get<AdminPolicy>(`${MY_TIME_API_PATH}/policies/${id}`);
  }

  createPolicies(dto: AdminPolicy): Observable<AdminPolicy> {
    return this.httpClient.post<AdminPolicy>(`${MY_TIME_API_PATH}/policies`, dto);
  }

  editPolicies(dto: AdminPolicy, id: string): Observable<AdminPolicy> {
    return this.httpClient.put<AdminPolicy>(`${MY_TIME_API_PATH}/policies/${id}`, dto);
  }

  delete(id: string): Observable<any> {
    return this.httpClient.delete(`${MY_TIME_API_PATH}/policies/${id}`, {});
  }
}
