import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { ACCOUNT_API_PATH, BaseResponse } from '@nexthcm/cdk';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { OrgChart } from '../models/node';

@Injectable()
export class HumanResourceService {
  public description!: OrgChart;
  public hovered = new EventEmitter();

  constructor(private httpClient: HttpClient) {}

  getOrg(): Observable<OrgChart[]> {
    return this.httpClient.get<OrgChart[]>(`${ACCOUNT_API_PATH}/org-chart`);
  }

  getOrgId(org: string | undefined): Observable<OrgChart[]> {
    return this.httpClient.get<OrgChart[]>(`${ACCOUNT_API_PATH}/org-chart${org ? `/${org}` : ''}`);
  }

  searchOrg(params: { filter: string }): Observable<OrgChart[]> {
    return this.httpClient.get<BaseResponse<OrgChart[]>>(`${ACCOUNT_API_PATH}/org-chart-filter`, { params }).pipe(
      map((response) => response.data),
      catchError(() => of([]))
    );
  }

  // getKnowledgeBase(params: { longDescription?: string; size: number }): Observable<Pagination<Partial<Knowledge>>> {
  //   return this.http
  //     .get<PagingResponse<Partial<Knowledge>>>(`${MY_TIME_API_PATH}/policies`, { params })
  //     .pipe(map((response) => response.data));
  // }

  // searchUsers(searchQuery: string): Observable<BaseObject[]> {
  //   return this.http.get<BaseResponse<BaseObject[]>>(`${ACCOUNT_API_PATH}/users/v2?search=${searchQuery}`).pipe(
  //     map((res) => res.data),
  //     catchError(() => of([]))
  //   );
  // }
}
