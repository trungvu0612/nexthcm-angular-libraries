import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse, MY_TIME_API_PATH, Pagination, PagingResponse } from '@nexthcm/cdk';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  CheckInPayload,
  CheckOutPayload,
  TimeKeepingLog,
  WorkingHours,
  WorkingHoursGroup,
  WorkingInfoCurrentMonth,
} from '../models';

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

  getTimekeepingLog(): Observable<TimeKeepingLog> {
    return this.http.get<BaseResponse<TimeKeepingLog>>(`${MY_TIME_API_PATH}/check-in-out`).pipe(
      map((res) => res.data),
      catchError(() => of({} as TimeKeepingLog))
    );
  }

  checkIn(id: string, payload: CheckInPayload): Observable<unknown> {
    return this.http.put<unknown>(`${MY_TIME_API_PATH}/check-in/${id}`, payload);
  }

  checkOut(id: string, payload: CheckOutPayload): Observable<unknown> {
    return this.http.put<unknown>(`${MY_TIME_API_PATH}/check-out/${id}`, payload);
  }
}
