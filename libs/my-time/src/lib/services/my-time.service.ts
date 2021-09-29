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
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Observable, Subject } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { GeneralRequest, SubmitRequestPayload } from '../models';
import { RequestComment } from '../models/request-comment';
import { CombineRequestTypeUrlPath, RequestTypeUrlPath } from '../models/request-type-url-path';
import { ChangeEscalateUserPayload } from '../models/requests/change-escalate-user-payload';
import { Tracking } from '../models/requests/tracking';
import { RequestDetailDialogComponent } from '../modules/shared/request-detail-dialog/request-detail-dialog.component';

const REQUEST_DETAIL_URL_PATHS: Readonly<CombineRequestTypeUrlPath> = Object.freeze({
  myWorkingAfterHours: 'ot-requests/me',
  workingAfterHours: 'ot-requests',
  myUpdateTimesheet: 'timesheet-updates/me',
  updateTimesheet: 'timesheet-updates',
  myWorkingOutside: 'outside/me',
  workingOutside: 'outside',
  myWorkFromHome: 'wfh/me',
  workFromHome: 'wfh',
  myLeave: 'leaves/me',
  leave: 'leaves',
});

const REQUEST_COMMENT_URL_PATHS: Readonly<RequestTypeUrlPath> = Object.freeze({
  workingAfterHours: 'hcm_ot_comment',
  updateTimesheet: 'hcm_update_time_comment',
  workingOutside: 'hcm_working_onsite_comment',
  workFromHome: 'hcm_wfh_comment',
  leave: 'hcm_leave_comment',
});

const REQUEST_HISTORY_URL_PATHS: Readonly<RequestTypeUrlPath> = Object.freeze({
  workingAfterHours: '1',
  updateTimesheet: '2',
  workingOutside: '3',
  workFromHome: '4',
  leave: '5',
});

@Injectable()
export class MyTimeService {
  private refreshSubject = new Subject<keyof RequestTypeUrlPath>();
  refresh$ = this.refreshSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly promptService: PromptService
  ) {}

  getRequests<T>(type: keyof CombineRequestTypeUrlPath, params: HttpParams): Observable<Pagination<T>> {
    return this.http
      .get<PagingResponse<T>>(`${MY_TIME_API_PATH}/${REQUEST_DETAIL_URL_PATHS[type]}`, { params })
      .pipe(map((res) => res.data));
  }

  submitRequest(type: keyof RequestTypeUrlPath, payload: SubmitRequestPayload): Observable<unknown> {
    return this.http
      .post(`${MY_TIME_API_PATH}/${REQUEST_DETAIL_URL_PATHS[type]}`, payload)
      .pipe(tap(() => this.refreshSubject.next(type)));
  }

  changeEscalateUser(type: keyof RequestTypeUrlPath, payload: ChangeEscalateUserPayload): Observable<unknown> {
    return this.http.post(`${MY_TIME_API_PATH}/${REQUEST_DETAIL_URL_PATHS[type]}/change-assignee`, payload);
  }

  changeRequestStatus(
    type: keyof RequestTypeUrlPath,
    requestId: string,
    nextState: string,
    callback?: () => void
  ): Observable<unknown> {
    return this.http
      .put(`${MY_TIME_API_PATH}/${REQUEST_DETAIL_URL_PATHS[type]}/${requestId}`, { request: { nextState } })
      .pipe(tap(this.promptService.handleResponse('', callback)));
  }

  getRequest(type: keyof RequestTypeUrlPath, id: string): Observable<BaseResponse<GeneralRequest>> {
    return this.http.get<BaseResponse<GeneralRequest>>(`${MY_TIME_API_PATH}/${REQUEST_DETAIL_URL_PATHS[type]}/${id}`);
  }

  viewRequestDetail(type: keyof RequestTypeUrlPath, id: string, userId?: string): Observable<unknown> {
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

  getEscalateUsers(searchQuery: string): Observable<EmployeeInfo[]> {
    return this.http
      .get<EmployeeInfo[]>(`${ACCOUNT_API_PATH}/users/get-manager`)
      .pipe(
        map((users) => users.filter((user) => user.fullName.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1))
      );
  }

  getRequestComments(type: keyof RequestTypeUrlPath, requestId: string): Observable<RequestComment[]> {
    return this.http
      .get<PagingResponse<RequestComment>>(`${MY_TIME_API_PATH}/comments-common`, {
        params: new HttpParams().set('type', REQUEST_COMMENT_URL_PATHS[type]).set('objectId', requestId),
      })
      .pipe(map((res) => res.data.items));
  }

  submitRequestComment(comment: RequestComment): Observable<BaseResponse<RequestComment>> {
    return this.http.post<BaseResponse<RequestComment>>(`${MY_TIME_API_PATH}/comments-common`, comment);
  }

  getRequestHistory(type: keyof RequestTypeUrlPath, requestId: string): Observable<Tracking[]> {
    return this.http
      .get<BaseResponse<Tracking[]>>(`${MY_TIME_API_PATH}/tracking-history/process`, {
        params: new HttpParams().set('type', REQUEST_HISTORY_URL_PATHS[type]).set('objectId', requestId),
      })
      .pipe(map((res) => res.data));
  }
}
