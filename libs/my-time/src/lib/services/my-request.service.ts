import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { PaginatorPlugin } from '@datorama/akita';
import { Environment, ENVIRONMENT, PagingResponse } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { Requests, SearchRequest } from '../models/requests';
import { LeaveTypeState, LeaveTypeStore } from '../state/leave-type/leave-type.store';
import { MY_REQUEST_PAGINATOR } from '../state/my-request/my-request.paginator';

@Injectable({
  providedIn: 'root',
})
export class MyRequestService {
  appVersion = this.env.apiUrl + '/mytimeapp/v1.0';

  constructor(
    @Inject(ENVIRONMENT) protected env: Environment,
    private leaveTypeStore: LeaveTypeStore,
    private httpClient: HttpClient,
    @Inject(MY_REQUEST_PAGINATOR) public paginatorRef: PaginatorPlugin<LeaveTypeState>
  ) {}

  getMyRequests(pageIndex: number, pageSize: number, search: SearchRequest): Observable<PagingResponse<Requests>> {
    let httpParams = new HttpParams();
    Object.keys(search).forEach((key) => {
      httpParams = httpParams.append(key, search[key as keyof SearchRequest]);
    });
    return this.httpClient.get<PagingResponse<Requests>>(this.appVersion + '/requests', {
      params: httpParams
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : ''),
    });
  }
}
