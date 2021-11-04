import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
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
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { from, Observable, of, Subject } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import {
  CombineRequestTypeUrlPaths,
  GeneralRequest,
  HistoryItem,
  RequestComment,
  RequestTypeUrlPaths,
  SubmitRequestPayload,
} from '../internal/models';
import { ChangeEscalateUserPayload } from '../internal/models/requests/change-escalate-user-payload';
import {
  LeaveDuplicated,
  SubmitLeaveRequestHttpErrorResponse,
} from '../internal/models/requests/submit-leave-request-http-error-response';
import { RequestDetailDialogComponent } from '../shared/request-detail-dialog/request-detail-dialog.component';

const REQUEST_DETAIL_URL_PATHS: Readonly<CombineRequestTypeUrlPaths> = Object.freeze({
  myWorkingAfterHours: 'ot-requests/me',
  workingAfterHours: 'ot-requests',
  myUpdateTimesheet: 'timesheet-updates/me',
  updateTimesheet: 'timesheet-updates',
  myWorkingOnsite: 'outside/me',
  workingOnsite: 'outside',
  myWorkFromHome: 'wfh/me',
  workFromHome: 'wfh',
  myLeave: 'leaves/me',
  leave: 'leaves',
  myTransferLeaveEntitlements: 'leave-entitlement-transfer/me',
  transferLeaveEntitlements: 'leave-entitlement-transfer',
});

export const REQUEST_COMMENT_URL_PATHS: Readonly<RequestTypeUrlPaths> = Object.freeze({
  workingAfterHours: 'hcm_ot_comment',
  updateTimesheet: 'hcm_update_time_comment',
  workingOnsite: 'hcm_working_onsite_comment',
  workFromHome: 'hcm_wfh_comment',
  leave: 'hcm_leave_comment',
});

const REQUEST_HISTORY_URL_PATHS: Readonly<RequestTypeUrlPaths> = Object.freeze({
  workingAfterHours: '1',
  updateTimesheet: '2',
  workingOnsite: '3',
  workFromHome: '4',
  leave: '5',
});

@Injectable()
export class MyTimeService {
  private refreshSubject = new Subject<keyof RequestTypeUrlPaths>();
  refresh$ = this.refreshSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly promptService: PromptService,
    private readonly translocoService: TranslocoService,
    private readonly translocoDatePipe: TranslocoDatePipe
  ) {}

  getRequests<T>(type: keyof CombineRequestTypeUrlPaths, params: HttpParams): Observable<Pagination<T>> {
    return this.http
      .get<PagingResponse<T>>(`${MY_TIME_API_PATH}/${REQUEST_DETAIL_URL_PATHS[type]}`, { params })
      .pipe(map((res) => res.data));
  }

  submitRequest(type: keyof RequestTypeUrlPaths, payload: SubmitRequestPayload): Observable<unknown> {
    return this.http
      .post(`${MY_TIME_API_PATH}/${REQUEST_DETAIL_URL_PATHS[type]}`, payload)
      .pipe(tap(() => this.refreshSubject.next(type)));
  }

  changeEscalateUser(type: keyof RequestTypeUrlPaths, payload: ChangeEscalateUserPayload): Observable<unknown> {
    return this.http.post(`${MY_TIME_API_PATH}/${REQUEST_DETAIL_URL_PATHS[type]}/change-assignee`, payload);
  }

  changeRequestStatus(type: keyof RequestTypeUrlPaths, requestId: string, nextState: string): Observable<unknown> {
    return this.http
      .put(`${MY_TIME_API_PATH}/${REQUEST_DETAIL_URL_PATHS[type]}/${requestId}`, { request: { nextState } })
      .pipe(
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

  getRequest(type: keyof RequestTypeUrlPaths, id: string): Observable<BaseResponse<GeneralRequest>> {
    return this.http.get<BaseResponse<GeneralRequest>>(`${MY_TIME_API_PATH}/${REQUEST_DETAIL_URL_PATHS[type]}/${id}`);
  }

  viewRequestDetail(type: keyof RequestTypeUrlPaths, id: string, userId?: string): Observable<unknown> {
    return this.getRequest(type, id).pipe(
      switchMap((res) =>
        this.dialogService.open(new PolymorpheusComponent(RequestDetailDialogComponent, this.injector), {
          data: {
            type,
            value: res.data,
            userId,
          },
        })
      )
    );
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
}
