import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagingResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { Requests, SearchRequest, SubmitRequest, WorkFromHome } from '../models';

const MY_TIME_PATH = '/mytimeapp/v1.0';

@Injectable()
export class MyRequestService {
  appVersion = '/mytimeapp/v1.0';

  constructor(private http: HttpClient) {}

  getWorkFromHome(
    pageIndex: number,
    pageSize: number,
    search: SearchRequest,
    userId: string
  ): Observable<PagingResponse<Requests>> {
    return this.http.get<PagingResponse<Requests>>(this.appVersion + '/wfh', {
      params: new HttpParams()
        .set('userId', userId)
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : '')
        .set('fromDate', search.fromDate ? search.fromDate : ('' as any))
        .set('toDate', search.toDate ? search.toDate : ('' as any)),
    });
  }

  getWFHId(id: string): Observable<any> {
    return this.http.get<any>(`${MY_TIME_PATH}/wfh${id ? `/${id}` : ''}`);
  }

  submitRequestFromHome(body: any): Observable<WorkFromHome> {
    return this.http.post<WorkFromHome>(`${MY_TIME_PATH}/wfh`, body);
  }

  submitRequestOutside(body: any, type: string): Observable<SubmitRequest> {
    if (type === 'ot') {
      return this.http.post<SubmitRequest>(this.appVersion + '/ot-requests', body);
    } else {
      return this.http.post<SubmitRequest>(this.appVersion + '/outside', body);
    }
  }
}
