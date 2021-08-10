import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse, PagingResponse, UserDto } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { RequestUpdateTime, WorkingHours, WorkingInfoCurrentMonth } from '../models';

@Injectable()
export class WorkingHoursService {
  appVersion = '/mytimeapp/v1.0';

  constructor(private httpClient: HttpClient) {}

  getWorkingHoursOnlyMe(params: HttpParams): Observable<PagingResponse<WorkingHours>> {
    return this.httpClient.get<PagingResponse<WorkingHours>>(this.appVersion + '/working-hours', { params });
  }

  getWorkingHoursEveryone(params: HttpParams): Observable<PagingResponse<WorkingHours>> {
    return this.httpClient.get<PagingResponse<WorkingHours>>(this.appVersion + '/working-hours-everyone', { params });
  }
  // getWorkingHoursOnlyMe(
  //   pageIndex: number,
  //   pageSize: number,
  //   search: SearchWorkingHours,
  //   userId: string
  // ): Observable<PagingResponse<WorkingHours>> {
  //   let httpParams = new HttpParams();
  //   Object.keys(search).forEach((key) => {
  //     httpParams = httpParams.append(key, search[key as keyof SearchWorkingHours]);
  //   });
  //   return this.httpClient.get<PagingResponse<WorkingHours>>(this.appVersion + '/working-hours?userId=' + userId, {
  //     params: httpParams
  //       .set('page', pageIndex ? pageIndex.toString() : '')
  //       .set('size', pageSize ? pageSize.toString() : ''),
  //   });
  // }

  getWorkingHoursDetail(id: any): Observable<WorkingHours> {
    return this.httpClient.get<WorkingHours>(this.appVersion + '/working-hours' + '/' + id);
  }

  getAllUsers(): Observable<PagingResponse<UserDto>> {
    return this.httpClient.get<PagingResponse<UserDto>>(`/accountapp/v1.0/users`);
  }

  submitRequestTime(dto: RequestUpdateTime): Observable<BaseResponse<RequestUpdateTime>> {
    return this.httpClient.post<BaseResponse<RequestUpdateTime>>(this.appVersion + '/working-hours', dto);
  }

  getWorkingHoursByDate(userId: string, fromDate: any, toDate: any): Observable<any> {
    return this.httpClient.get<any>(
      this.appVersion + '/working-hours?userId=' + userId + '&fromDate=' + fromDate + '&toDate=' + toDate
    );
  }

  getWorkingInfoCurrentMonth(): Observable<BaseResponse<WorkingInfoCurrentMonth>> {
    return this.httpClient.get<BaseResponse<WorkingInfoCurrentMonth>>(
      `${this.appVersion}/working-hours/display-total-working-day-per-month`
    );
  }
}
