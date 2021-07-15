import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig, PagingResponse } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { Requests, SearchRequest, TimeSheetUpdateReq } from '../models/requests';
import { MyLeave } from '../models/my-leave';
import { map } from 'rxjs/operators';

const MY_TIME_PATH = '/mytimeapp/v1.0';
const MY_ACCOUNT_PATH = '/accountapp/v1.0';
@Injectable({
  providedIn: 'root',
})
export class MyRequestService {
  appVersion = this.env.apiUrl + '/mytimeapp/v1.0';

  constructor(@Inject(APP_CONFIG) protected env: AppConfig, private httpClient: HttpClient) {}

  getMyOtRequests(pageIndex: number, pageSize: number, search: SearchRequest): Observable<PagingResponse<Requests>> {
    return this.httpClient.get<PagingResponse<Requests>>(this.appVersion + '/ot-requests', {
      params: new HttpParams()
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : '')
        .set('fromDate', search.fromDate ? search.fromDate : ('' as any))
        .set('toDate', search.toDate ? search.toDate : ('' as any)),
    });
  }

  createOTRequest(dto: Requests): Observable<Requests> {
    return this.httpClient.post<Requests>(this.appVersion + '/ot-requests', dto);
  }

  editOTRequest(dto: Requests, id: string): Observable<Requests> {
    return this.httpClient.put<Requests>(this.appVersion + `/ot-requests/${id}`, dto);
  }

  geWorkingOutsideRequests(
    pageIndex: number,
    pageSize: number,
    search: SearchRequest
  ): Observable<PagingResponse<Requests>> {
    return this.httpClient.get<PagingResponse<Requests>>(this.appVersion + '/outside-requests', {
      params: new HttpParams()
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : '')
        .set('fromDate', search.fromDate ? search.fromDate : ('' as any))
        .set('toDate', search.toDate ? search.toDate : ('' as any)),
    });
  }

  getWorkFromHome(pageIndex: number, pageSize: number, search: SearchRequest): Observable<PagingResponse<Requests>> {
    return this.httpClient.get<PagingResponse<Requests>>(this.appVersion + '/wfh', {
      params: new HttpParams()
        .set('userId', '934e5a26-8ade-4d3b-b7d9-28e11a1e4c2a')
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : '')
        .set('startDate', search.fromDate ? search.fromDate : ('' as any))
        .set('endDate', search.toDate ? search.toDate : ('' as any)),
    });
  }

  getWFHId(id: string): Observable<any> {
    if (id === undefined || id == '') {
      return this.httpClient.get<any>(this.env.apiUrl + `${MY_TIME_PATH}/wfh/`, {}).pipe(map((res) => res as any));
    } else {
      return this.httpClient
        .get<any>(this.env.apiUrl + `${MY_TIME_PATH}/wfh/${id}`, {})
        .pipe(map((res) => res as any));
    }
  }

  createWorkingOutsideRequest(dto: Requests): Observable<Requests> {
    return this.httpClient.post<Requests>(this.appVersion + '/outside-requests', dto);
  }

  editWorkingOutsideRequest(dto: Requests, id: string): Observable<Requests> {
    return this.httpClient.put<Requests>(this.appVersion + `/outside-requests/${id}`, dto);
  }

  getTimeSheetUpdateReqs(
    pageIndex: number,
    pageSize: number,
    search: SearchRequest
  ): Observable<PagingResponse<TimeSheetUpdateReq>> {
    return this.httpClient.get<PagingResponse<TimeSheetUpdateReq>>(this.appVersion + '/timesheet-updates', {
      params: new HttpParams()
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : '')
        .set('fromDate', search.fromDate ? search.fromDate : ('' as any))
        .set('toDate', search.toDate ? search.toDate : ('' as any)),
    });
  }

  createTimeSheetUpdateReqs(dto: Requests): Observable<TimeSheetUpdateReq> {
    return this.httpClient.post<TimeSheetUpdateReq>(this.appVersion + '/timesheet-updates', dto);
  }

  editTimeSheetUpdateReqs(dto: TimeSheetUpdateReq, id: string): Observable<TimeSheetUpdateReq> {
    return this.httpClient.put<TimeSheetUpdateReq>(this.appVersion + `/timesheet-updates/${id}`, dto);
  }
}
