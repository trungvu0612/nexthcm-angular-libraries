import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ACCOUNT_API_PATH, BaseResponse, EmployeeInfo, MY_TIME_API_PATH, PagingResponse } from '@nexthcm/cdk';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { REQUEST_COMMENT_URL_PATHS, REQUEST_DETAIL_URL_PATHS } from '../internal/constants';
import { HistoryItem, RequestComment, RequestTypeUrlPaths } from '../internal/models';
import { ChangeEscalateUserPayload } from '../internal/models/requests/change-escalate-user-payload';

const REQUEST_HISTORY_URL_PATHS: Readonly<RequestTypeUrlPaths> = Object.freeze({
  workingAfterHours: '1',
  updateTimesheet: '2',
  workingOnsite: '3',
  workFromHome: '4',
  leave: '5',
});

@Injectable()
export class MyTimeService {
  constructor(private readonly http: HttpClient) {}

  changeEscalateUser(type: keyof RequestTypeUrlPaths, payload: ChangeEscalateUserPayload): Observable<unknown> {
    return this.http.post(`${MY_TIME_API_PATH}/${REQUEST_DETAIL_URL_PATHS[type]}/change-assignee`, payload);
  }

  getEscalateUsers(type: keyof RequestTypeUrlPaths, requestId: string): Observable<EmployeeInfo[]> {
    return this.http
      .get<BaseResponse<EmployeeInfo[]>>(
        type === 'leave'
          ? `${MY_TIME_API_PATH}/leaves/get-escalate-user-by-leave-id/${requestId}`
          : `${ACCOUNT_API_PATH}/users/get-manager`
      )
      .pipe(
        map((res) => res.data),
        catchError(() => of([]))
      );
  }

  getRequestComments(type: keyof RequestTypeUrlPaths, requestId: string): Observable<RequestComment[]> {
    return this.http
      .get<PagingResponse<RequestComment>>(`${MY_TIME_API_PATH}/comments-common`, {
        params: new HttpParams().set('type', REQUEST_COMMENT_URL_PATHS[type] as string).set('objectId', requestId),
      })
      .pipe(map((res) => res.data.items));
  }

  addRequestComment(comment: RequestComment): Observable<BaseResponse<RequestComment>> {
    return this.http.post<BaseResponse<RequestComment>>(`${MY_TIME_API_PATH}/comments-common`, comment);
  }

  updateRequestComment(comment: RequestComment): Observable<unknown> {
    return this.http.put(`${MY_TIME_API_PATH}/comments-common/${comment.id}`, comment);
  }

  getRequestHistory(type: keyof RequestTypeUrlPaths, requestId: string): Observable<HistoryItem[]> {
    return this.http
      .get<BaseResponse<HistoryItem[]>>(`${MY_TIME_API_PATH}/tracking-history/process`, {
        params: new HttpParams().set('type', REQUEST_HISTORY_URL_PATHS[type] as string).set('objectId', requestId),
      })
      .pipe(map((res) => res.data));
  }
}
