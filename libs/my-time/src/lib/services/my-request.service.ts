import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PagingResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WorkFromHome } from '../models';
import { Requests, SearchRequest, SubmitRequest, TimeSheetUpdateReq } from '../models';

const MY_TIME_PATH = '/mytimeapp/v1.0';

@Injectable({
  providedIn: 'root',
})
export class MyRequestService {
  appVersion = '/mytimeapp/v1.0';

  constructor(private httpClient: HttpClient) {}

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
    return this.httpClient.get<PagingResponse<Requests>>(this.appVersion + '/outside', {
      params: new HttpParams()
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : '')
        .set('fromDate', search.fromDate ? search.fromDate : ('' as any))
        .set('toDate', search.toDate ? search.toDate : ('' as any)),
    });
  }

  getWorkFromHome(
    pageIndex: number,
    pageSize: number,
    search: SearchRequest,
    userId: string
  ): Observable<PagingResponse<Requests>> {
    return this.httpClient.get<PagingResponse<Requests>>(this.appVersion + '/wfh', {
      params: new HttpParams()
        .set('userId', userId)
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : '')
        .set('fromDate', search.fromDate ? search.fromDate : ('' as any))
        .set('toDate', search.toDate ? search.toDate : ('' as any)),
    });
  }

  getWorkFromHomeManagement(
    pageIndex: number,
    pageSize: number,
    search: SearchRequest
  ): Observable<PagingResponse<Requests>> {
    return this.httpClient.get<PagingResponse<Requests>>(this.appVersion + '/wfh', {
      params: new HttpParams()
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : '')
        .set('fromDate', search.fromDate ? search.fromDate : ('' as any))
        .set('toDate', search.toDate ? search.toDate : ('' as any)),
    });
  }

  getWFHId(id: string): Observable<any> {
    if (id === undefined || id == '') {
      return this.httpClient.get<any>(`${MY_TIME_PATH}/wfh/`, {}).pipe(map((res) => res as any));
    } else {
      return this.httpClient.get<any>(`${MY_TIME_PATH}/wfh/${id}`, {}).pipe(map((res) => res as any));
    }
  }

  createWorkingOutsideRequest(dto: Requests): Observable<Requests> {
    return this.httpClient.post<Requests>(this.appVersion + '/outside', dto);
  }

  editWorkingOutsideRequest(dto: Requests, id: string): Observable<Requests> {
    return this.httpClient.put<Requests>(this.appVersion + `/outside/${id}`, dto);
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

  submitRequestFromHome(body: any): Observable<WorkFromHome> {
    return this.httpClient.post<WorkFromHome>(`${MY_TIME_PATH}/wfh`, body);
  }

  submitRequestOutside(body: any, type: string): Observable<SubmitRequest> {
    if (type === 'ot') {
      return this.httpClient.post<SubmitRequest>(this.appVersion + '/ot-requests', body);
    } else {
      return this.httpClient.post<SubmitRequest>(this.appVersion + '/outside', body);
    }
  }

  // submitAfterTime(body: any): Observable<SubmitRequest> {
  //   return this.httpClient.post<SubmitRequest>(this.appVersion + '/ot-requests', body);
  // }
}
