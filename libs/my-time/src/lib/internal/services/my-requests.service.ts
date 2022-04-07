import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ACCOUNT_API_PATH,
  BaseResponse,
  EmployeeInfo,
  MY_TIME_API_PATH,
  Pagination,
  PagingResponse,
  PromptService,
} from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { TranslocoDatePipe } from '@ngneat/transloco-locale';
import { from, Observable, of, Subject } from 'rxjs';
import { catchError, map, mapTo, tap } from 'rxjs/operators';

import { REQUEST_COMMENT_URL_PATHS, REQUEST_DETAIL_URL_PATHS } from '../constants';
import {
  CombineRequestTypeUrlPaths,
  GeneralRequest,
  HistoryItem,
  RequestChange,
  RequestComment,
  RequestTypeUrlPaths,
  StatusTransition,
} from '../models';
import { ChangeEscalateUserPayload } from '../models/requests/change-escalate-user-payload';
import {
  LeaveDuplicated,
  SubmitLeaveRequestHttpErrorResponse,
} from '../models/requests/submit-leave-request-http-error-response';

const REQUEST_HISTORY_URL_PATHS: Readonly<RequestTypeUrlPaths> = Object.freeze({
  workingAfterHours: '1',
  updateTimesheet: '2',
  workingOnsite: '3',
  workFromHome: '4',
  leave: '5',
});
const EXPORT_REQUEST_PATHS: Readonly<Partial<RequestTypeUrlPaths>> = Object.freeze({
  workingAfterHours: 'export-ot-requests',
  workingOnsite: 'export-outside',
});

@Injectable()
export class MyRequestsService {
  type!: keyof RequestTypeUrlPaths;
  private refreshSubject = new Subject<keyof RequestTypeUrlPaths>();
  refresh$ = this.refreshSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly promptService: PromptService,
    private readonly translocoService: TranslocoService,
    private readonly translocoDatePipe: TranslocoDatePipe
  ) {}

  getRequests<T>(type: keyof CombineRequestTypeUrlPaths, params: HttpParams): Observable<Pagination<T>> {
    return this.http
      .get<PagingResponse<T>>(`${MY_TIME_API_PATH}/${REQUEST_DETAIL_URL_PATHS[type]}`, { params })
      .pipe(map((res) => res.data));
  }

  exportRequests(type: keyof RequestTypeUrlPaths, params: HttpParams): Observable<{ blob: Blob; filename?: string }> {
    return this.http
      .get(`${MY_TIME_API_PATH}/${EXPORT_REQUEST_PATHS[type]}`, {
        params,
        responseType: 'blob',
        observe: 'response',
      })
      .pipe(
        map(({ body, headers }) => ({
          blob: body as Blob,
          filename: headers.get('Content-Disposition')?.split('filename=')[1],
        }))
      );
  }

  submitRequest<T>(type: keyof RequestTypeUrlPaths, payload: T): Observable<unknown> {
    return this.http
      .post(`${MY_TIME_API_PATH}/${REQUEST_DETAIL_URL_PATHS[type]}`, payload)
      .pipe(tap(() => this.refreshSubject.next(type)));
  }

  checkDuplicateRequestTime<T>(
    type: keyof Pick<RequestTypeUrlPaths, 'workingOnsite' | 'workFromHome'>,
    payload: T
  ): Observable<boolean> {
    return this.http
      .post(`${MY_TIME_API_PATH}/${REQUEST_DETAIL_URL_PATHS[type]}/check-duplicate-request`, payload)
      .pipe(
        mapTo(true),
        catchError(() => of(false))
      );
  }

  changeRequestStatus(type: keyof RequestTypeUrlPaths, requestId: string, nextState: string): Observable<unknown> {
    return this.http
      .put(`${MY_TIME_API_PATH}/${REQUEST_DETAIL_URL_PATHS[type]}/${requestId}`, { request: { nextState } })
      .pipe(
        tap(() => this.refreshSubject.next(type)),
        catchError((err) =>
          from(
            this.promptService.open({
              icon: 'error',
              html: this.generateSubmittingLeaveRequestErrorMessage(err.error),
            })
          )
        )
      );
  }

  getRequest(type: keyof RequestTypeUrlPaths, id: string): Observable<GeneralRequest> {
    return this.http
      .get<BaseResponse<GeneralRequest>>(`${MY_TIME_API_PATH}/${REQUEST_DETAIL_URL_PATHS[type]}/${id}`)
      .pipe(map((res) => res.data));
  }

  generateSubmittingLeaveRequestErrorMessage(error: SubmitLeaveRequestHttpErrorResponse): string {
    if (error.message === 'LEAVE_IS_DUPLICATED_DURATION_WITH_ANOTHER_LEAVE') {
      let metadata = '';

      if (error.errorMetadata.leaveDuplicatedList.length) {
        metadata = `<ul class="tui-list text-left">${error.errorMetadata.leaveDuplicatedList.map(
          (item: LeaveDuplicated) =>
            `<li class="tui-list__item">${this.translocoDatePipe.transform(
              item.fromDate
            )} - ${this.translocoDatePipe.transform(item.toDate)}: <b>${item.leaveTypeName}</b></li>`
        )}</ul>`;
      }
      return this.translocoService.translate('myTime.ERRORS.DUPLICATED_LEAVE', { metadata });
    } else if (error.message === 'LEAVE_SUBMIT_LEAVE_DURATION_EXCEED_LEAVE_ENTITLEMENT') {
      return this.translocoService.translate('myTime.ERRORS.EXCEED_LEAVE_ENTITLEMENT', error.errorMetadata);
    }
    return error.message;
  }

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

  getLeaveEscalationUser(leaveId: string, currentAssigneeId?: string): Observable<EmployeeInfo | null> {
    return currentAssigneeId
      ? this.http
          .get<BaseResponse<EmployeeInfo | null>>(
            `${MY_TIME_API_PATH}/leaves/get-escalate-user-by-user-id/${currentAssigneeId}?leaveId=${leaveId}`
          )
          .pipe(map((res) => res.data))
      : of(null);
  }

  getStatusTransitions(type: keyof RequestTypeUrlPaths, ids: string): Observable<StatusTransition[]> {
    this.type = type;
    return this.http
      .get<BaseResponse<StatusTransition[]>>(
        `${MY_TIME_API_PATH}/${REQUEST_DETAIL_URL_PATHS[type]}/operation-transactions`,
        {
          params: new HttpParams().set(type === 'leave' ? 'leaveIds' : 'reqIds', ids),
        }
      )
      .pipe(map(({ data }) => data));
  }

  bulkChange(body: RequestChange[]): Observable<unknown> {
    return this.http.put<unknown>(`${MY_TIME_API_PATH}/${REQUEST_DETAIL_URL_PATHS[this.type]}/bulk-approve`, body);
  }
}
