import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse, MY_TIME_API_PATH, Pagination, PagingResponse } from '@nexthcm/cdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WorkingHours, WorkingHoursGroup, WorkingInfoCurrentMonth } from '../models';

@Injectable()
export class WorkingHoursService {
  constructor(private http: HttpClient) {}

  getWorkingHoursOfOnlyMe(params: HttpParams): Observable<Pagination<WorkingHours>> {
    return this.http
      .get<PagingResponse<WorkingHours>>(`${MY_TIME_API_PATH}/working-hours`, { params })
      .pipe(map((res) => res.data));
  }

  getWorkingHoursOfEveryone(params: HttpParams): Observable<Pagination<WorkingHoursGroup>> {
    return this.http
      .get<PagingResponse<WorkingHoursGroup>>(`${MY_TIME_API_PATH}/working-hours-everyone`, { params })
      .pipe(map((res) => res.data));
  }

  getWorkingTimeCurrentMonth(): Observable<WorkingInfoCurrentMonth> {
    return this.http
      .get<BaseResponse<WorkingInfoCurrentMonth>>(
        `${MY_TIME_API_PATH}/working-hours/display-total-working-day-per-month`
      )
      .pipe(map((res) => res.data));
  }
}
