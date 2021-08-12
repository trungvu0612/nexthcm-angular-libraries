import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse, Pagination, PagingResponse, UserDto } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RequestUpdateTime, WorkingHours, WorkingHoursGroup, WorkingInfoCurrentMonth } from '../models';

@Injectable()
export class WorkingHoursService {
  appVersion = '/mytimeapp/v1.0';

  constructor(private http: HttpClient) {}

  getWorkingHoursOfOnlyMe(params: HttpParams): Observable<Pagination<WorkingHours>> {
    return this.http
      .get<PagingResponse<WorkingHours>>(this.appVersion + '/working-hours', { params })
      .pipe(map((res) => res.data));
  }

  getWorkingHoursOfEveryone(params: HttpParams): Observable<Pagination<WorkingHoursGroup>> {
    return this.http
      .get<PagingResponse<WorkingHoursGroup>>(this.appVersion + '/working-hours-everyone', { params })
      .pipe(map((res) => res.data));
  }

  getWorkingHoursDetail(id: any): Observable<WorkingHours> {
    return this.http.get<WorkingHours>(this.appVersion + '/working-hours' + '/' + id);
  }

  getAllUsers(): Observable<PagingResponse<UserDto>> {
    return this.http.get<PagingResponse<UserDto>>(`/accountapp/v1.0/users`);
  }

  submitRequestTime(dto: RequestUpdateTime): Observable<BaseResponse<RequestUpdateTime>> {
    return this.http.post<BaseResponse<RequestUpdateTime>>(this.appVersion + '/working-hours', dto);
  }

  getWorkingHoursByDate(userId: string, fromDate: any, toDate: any): Observable<any> {
    return this.http.get<any>(
      this.appVersion + '/working-hours?userId=' + userId + '&fromDate=' + fromDate + '&toDate=' + toDate
    );
  }

  getWorkingTimeCurrentMonth(): Observable<WorkingInfoCurrentMonth> {
    return this.http
      .get<BaseResponse<WorkingInfoCurrentMonth>>(
        `${this.appVersion}/working-hours/display-total-working-day-per-month`
      )
      .pipe(map((res) => res.data));
  }
}
