import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MY_TIME_API_PATH, Pagination, PagingResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { AdminPolicy } from './models/policies';
import { map } from 'rxjs/operators';

@Injectable()
export class AdminKnowledgeBaseService {
  constructor(private http: HttpClient) {}

  getPolicies(params: HttpParams): Observable<Pagination<AdminPolicy>> {
    return this.http
      .get<PagingResponse<AdminPolicy>>(`${MY_TIME_API_PATH}/policies`, { params })
      .pipe(map((res) => res.data));
  }

  getPolicy(id: string): Observable<AdminPolicy> {
    return this.http.get<AdminPolicy>(`${MY_TIME_API_PATH}/policies/${id}`);
  }

  createPolicies(dto: AdminPolicy): Observable<AdminPolicy> {
    return this.http.post<AdminPolicy>(`${MY_TIME_API_PATH}/policies`, dto);
  }

  editPolicies(dto: AdminPolicy, id: string): Observable<AdminPolicy> {
    return this.http.put<AdminPolicy>(`${MY_TIME_API_PATH}/policies/${id}`, dto);
  }

  delete(id: string): Observable<unknown> {
    return this.http.delete(`${MY_TIME_API_PATH}/policies/${id}`, {});
  }
}
