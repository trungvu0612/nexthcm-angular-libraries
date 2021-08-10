import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse, PagingResponse, UserDto } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { RequestUpdateTime, SearchWorkingHour, WorkingHour } from '../models/working-hour';

@Injectable({
  providedIn: 'root',
})
export class WorkingHourService {
  appVersion = '/mytimeapp/v1.0';

  constructor(private httpClient: HttpClient) {}

  getWorkingHourOnlyMe(params: HttpParams): Observable<PagingResponse<WorkingHour>> {
    return this.httpClient.get<PagingResponse<WorkingHour>>(this.appVersion + '/working-hours', { params });
  }

  getWorkingHourEveryone(params: HttpParams): Observable<PagingResponse<WorkingHour>> {
    return this.httpClient.get<PagingResponse<WorkingHour>>(this.appVersion + '/working-hours-everyone', { params });
  }
  // getWorkingHourOnlyMe(
  //   pageIndex: number,
  //   pageSize: number,
  //   search: SearchWorkingHour,
  //   userId: string
  // ): Observable<PagingResponse<WorkingHour>> {
  //   let httpParams = new HttpParams();
  //   Object.keys(search).forEach((key) => {
  //     httpParams = httpParams.append(key, search[key as keyof SearchWorkingHour]);
  //   });
  //   return this.httpClient.get<PagingResponse<WorkingHour>>(this.appVersion + '/working-hours?userId=' + userId, {
  //     params: httpParams
  //       .set('page', pageIndex ? pageIndex.toString() : '')
  //       .set('size', pageSize ? pageSize.toString() : ''),
  //   });
  // }

  getWorkingHourDetail(id: any): Observable<WorkingHour> {
    return this.httpClient.get<WorkingHour>(this.appVersion + '/working-hours' + '/' + id);
  }

  getAllUsers(): Observable<PagingResponse<UserDto>> {
    return this.httpClient.get<PagingResponse<UserDto>>(`/accountapp/v1.0/users`);
  }

  submitRequestTime(dto: RequestUpdateTime): Observable<BaseResponse<RequestUpdateTime>> {
    return this.httpClient.post<BaseResponse<RequestUpdateTime>>(this.appVersion + '/working-hours', dto);
  }

  getWorkingHourByDate(userId: string, fromDate: any, toDate: any): Observable<any> {
    return this.httpClient.get<any>(
      this.appVersion + '/working-hours?userId=' + userId + '&fromDate=' + fromDate + '&toDate=' + toDate
    );
  }
}
