import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { APP_CONFIG, AppConfig, PagingResponse, UserDto } from '@nexthcm/core';
import { Observable } from 'rxjs';
import { RequestUpdateTime, SearchWorkingHour, WorkingHour } from '../models/working-hour';
import { BaseResponse } from '@nexthcm/core';

@Injectable({
  providedIn: 'root',
})
export class WorkingHourService {
  appVersion = this.env.apiUrl + '/mytimeapp/v1.0';

  constructor(@Inject(APP_CONFIG) protected env: AppConfig, private httpClient: HttpClient) {}

  getWorkingHour(
    pageIndex: number,
    pageSize: number,
    search: SearchWorkingHour
  ): Observable<PagingResponse<WorkingHour>> {
    let httpParams = new HttpParams();
    Object.keys(search).forEach((key) => {
      httpParams = httpParams.append(key, search[key as keyof SearchWorkingHour]);
    });
    return this.httpClient.get<PagingResponse<WorkingHour>>(this.appVersion + '/working-hours', {
      params: httpParams
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : ''),
    });
  }

  getWorkingHourOnlyMe(
    pageIndex: number,
    pageSize: number,
    search: SearchWorkingHour,
    userId: string
  ): Observable<PagingResponse<WorkingHour>> {
    let httpParams = new HttpParams();
    Object.keys(search).forEach((key) => {
      httpParams = httpParams.append(key, search[key as keyof SearchWorkingHour]);
    });
    return this.httpClient.get<PagingResponse<WorkingHour>>(this.appVersion + '/working-hours?userId=' + userId, {
      params: httpParams
        .set('page', pageIndex ? pageIndex.toString() : '')
        .set('size', pageSize ? pageSize.toString() : ''),
    });
  }

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
