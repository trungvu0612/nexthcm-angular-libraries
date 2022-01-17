import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseResponse, MY_TIME_API_PATH, Pagination, PagingResponse, WorkflowStatus } from '@nexthcm/cdk';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { RequestType } from '../internal/enums';
import { CheckInOutPayload, TimeKeepingLog, WorkingHours, WorkingInfoCurrentMonth } from '../models';

@Injectable()
export class MyTimeService {
  constructor(private http: HttpClient) {}

  getWorkingHoursOfOnlyMe(params: HttpParams): Observable<Pagination<WorkingHours>> {
    return this.http
      .get<PagingResponse<WorkingHours>>(`${MY_TIME_API_PATH}/working-hours`, { params })
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
    return this.http.get<BaseResponse<TimeKeepingLog>>(`${MY_TIME_API_PATH}/status-check-in-out`).pipe(
      map((res) => res.data),
      catchError(() => of({} as TimeKeepingLog))
    );
  }

  checkInOut(payload: CheckInOutPayload): Observable<unknown> {
    return this.http.post<unknown>(`${MY_TIME_API_PATH}/check-in-out`, payload);
  }

  getSecondWorkflowStatus(type: RequestType, leaveTypeId?: string): Observable<WorkflowStatus[]> {
    let params = new HttpParams().set('type', type);

    if (type === RequestType.Leave && leaveTypeId) {
      params = params.set('leaveTypeId', leaveTypeId);
    }
    return this.http
      .get<BaseResponse<WorkflowStatus[]>>(`${MY_TIME_API_PATH}/configurations/requests/states-by-process`, {
        params,
      })
      .pipe(map((res) => res.data));
  }
}
