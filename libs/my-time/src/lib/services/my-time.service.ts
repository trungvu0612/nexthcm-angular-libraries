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
import { GeneralRequest, SubmitRequestPayload, UpdateRequestPayload } from '../models';
import { RequestComment } from '../models/request-comment';
import { ChangeEscalateUserPayload } from '../models/requests/change-escalate-user-payload';
import { Tracking } from '../models/requests/tracking';
import { RequestDetailDialogComponent } from '../modules/shared/request-detail-dialog/request-detail-dialog.component';

export enum RequestTypeAPIUrlPath {
  MyLeave = 'leaves' as any,
  leave = 'leaves' as any,
  workingAfterHours = 'ot-requests' as any,
  updateTimesheet = 'timesheet-updates' as any,
  workingOutside = 'outside' as any,
  workFromHome = 'wfh' as any,
}

export enum RequestTypeComment {
  leave = 'hcm_leave_comment' as any,
  workingAfterHours = 'hcm_ot_comment' as any,
  updateTimesheet = 'hcm_update_time_comment' as any,
  workingOutside = 'hcm_working_onsite_comment' as any,
  workFromHome = 'hcm_wfh_comment' as any,
}

@Injectable()
export class MyTimeService {
  private refreshSubject = new Subject<RequestTypeAPIUrlPath>();
  refresh$ = this.refreshSubject.asObservable();

  constructor(
    private http: HttpClient,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private promptService: PromptService
  ) {}

  getSendToUsers(): Observable<EmployeeInfo[]> {
    return this.http
      .get<PagingResponse<EmployeeInfo>>(`${ACCOUNT_API_PATH}/employees`)
      .pipe(map((res) => res.data.items));
  }

  getComments(objectId?: string): Observable<PagingResponse<any>> {
    const typeComment = 'hcm_working_hours_comment';
    return this.http.get<PagingResponse<any>>(
      `${MY_TIME_API_PATH}/comments-common?objectId=${objectId}&type=` + typeComment
    );
  }

  getRequests<T>(type: RequestTypeAPIUrlPath, params: HttpParams): Observable<Pagination<T>> {
    return this.http.get<PagingResponse<T>>(`${MY_TIME_API_PATH}/${type}/me`, { params }).pipe(map((res) => res.data));
  }

  submitRequest(type: RequestTypeAPIUrlPath, payload: SubmitRequestPayload): Observable<unknown> {
    return this.http.post(`${MY_TIME_API_PATH}/${type}`, payload).pipe(tap(() => this.refreshSubject.next(type)));
  }

  updateRequest(type: RequestTypeAPIUrlPath, id: string, payload: UpdateRequestPayload): Observable<unknown> {
    return this.http.put(`${MY_TIME_API_PATH}/${type}/${id}`, payload);
  }

  changeEscalateUser(type: RequestTypeAPIUrlPath, payload: ChangeEscalateUserPayload): Observable<unknown> {
    return this.http.post(`${MY_TIME_API_PATH}/${type}/change-assignee`, payload);
  }

  changeRequestStatus(
    type: RequestTypeAPIUrlPath,
    requestId: string,
    nextState: string,
    callback?: () => void
  ): Observable<unknown> {
    return this.http
      .put(`${MY_TIME_API_PATH}/${type}/${requestId}`, { request: { nextState } })
      .pipe(tap(this.promptService.handleResponse('', callback)));
  }

  getRequest(type: RequestTypeAPIUrlPath, id: string): Observable<BaseResponse<GeneralRequest>> {
    return this.http.get<BaseResponse<GeneralRequest>>(`${MY_TIME_API_PATH}/${type}/${id}`);
  }

  viewRequestDetail(type: RequestTypeAPIUrlPath, id: string, userId?: string): Observable<unknown> {
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

  getRequestComment(params: HttpParams): Observable<Pagination<RequestComment>> {
    return this.http
      .get<PagingResponse<RequestComment>>(`${MY_TIME_API_PATH}/comments-common`, { params })
      .pipe(map((res) => res.data));
  }

  submitReqComment(comment: RequestComment): Observable<BaseResponse<RequestComment>> {
    return this.http.post<BaseResponse<RequestComment>>(`${MY_TIME_API_PATH}/comments-common`, comment);
  }

  getRequestTracking(type: RequestTypeAPIUrlPath, reqId: string): Observable<Tracking[]> {
    return this.http
      .get<BaseResponse<Tracking[]>>(`${MY_TIME_API_PATH}/${type}/tracking-history/${reqId}`)
      .pipe(map((res) => res.data));
  }
}
