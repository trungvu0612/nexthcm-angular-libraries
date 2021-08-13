import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BaseResponse, EmployeeInfo, Pagination, PagingResponse, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { from, iif, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { TrackingHistory, UpdateRequestPayload } from '../models';
import { GeneralRequest } from '../models/interfaces/general-request';
import { SubmitRequestPayload } from '../models/interfaces/submit-request-payload';
import { RejectRequestDialogComponent } from '../modules/request-management/components/reject-leave-request-dialog/reject-request-dialog.component';
import { RequestDetailDialogComponent } from '../modules/shared/request-detail-dialog/request-detail-dialog.component';
import { parseLeaveDateRange } from '../modules/shared/utils/parse-leave-date-range';

interface ServiceState {
  sendToUsers: EmployeeInfo[];
}

const MY_TIME_PATH = '/mytimeapp/v1.0';
const ACCOUNT_PATH = '/accountapp/v1.0';

export enum RequestTypeAPIUrlPath {
  leave = 'leaves' as any,
  workingAfterHours = 'ot-requests' as any,
  updateTimesheet = 'timesheet-updates' as any,
  workingOutside = 'outside' as any,
  workFromHome = 'wfh' as any,
}

export enum RequestTypeComment {
  leave = 'hcm_leave_comment' as any,
  workingAfterHours = 'hcm_working_hours_comment' as any,
  updateTimesheet = 'hcm_update_time_comment' as any,
  workingOutside = 'hcm_working_onsite_comment' as any,
  workFromHome = 'hcm_wfh_comment' as any,
}

@Injectable()
export class MyTimeService extends RxState<ServiceState> {
  constructor(
    private http: HttpClient,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private promptService: PromptService,
    private translocoService: TranslocoService
  ) {
    super();
    this.connect('sendToUsers', this.getSendToUsers());
  }

  getSendToUsers(): Observable<EmployeeInfo[]> {
    return this.http.get<PagingResponse<EmployeeInfo>>(`${ACCOUNT_PATH}/users`).pipe(map((res) => res.data.items));
  }

  getTrackingHistory(id?: string): Observable<TrackingHistory[]> {
    return this.http.get<TrackingHistory[]>(`${MY_TIME_PATH}/leaves/tracking-history/${id}`);
  }

  getComments(objectId?: string): Observable<PagingResponse<any>> {
    const typeComment = 'hcm_working_hours_comment';
    return this.http.get<PagingResponse<any>>(`${MY_TIME_PATH}/comments-common?objectId=${objectId}&type=`+typeComment);
  }

  getRequests<T>(type: RequestTypeAPIUrlPath, params: HttpParams): Observable<Pagination<T>> {
    return this.http.get<PagingResponse<T>>(`${MY_TIME_PATH}/${type}`, { params }).pipe(map((res) => res.data));
  }

  submitRequest(type: RequestTypeAPIUrlPath, payload: SubmitRequestPayload): Observable<unknown> {
    return this.http.post<unknown>(`${MY_TIME_PATH}/${type}`, payload);
  }

  updateRequest(type: RequestTypeAPIUrlPath, id: string, payload: UpdateRequestPayload): Observable<unknown> {
    return this.http.put<unknown>(`${MY_TIME_PATH}/${type}/${id}`, payload);
  }

  getRequest(type: RequestTypeAPIUrlPath, id: string): Observable<BaseResponse<GeneralRequest>> {
    return this.http.get<BaseResponse<GeneralRequest>>(`${MY_TIME_PATH}/${type}/${id}`);
  }

  approveRequest(type: RequestTypeAPIUrlPath, id: string, callback?: () => void): Observable<unknown> {
    return from(
      this.promptService.open({
        icon: 'warning',
        showCancelButton: true,
        html: this.translocoService.translate('approveRequestWarning'),
      } as SweetAlertOptions)
    ).pipe(
      switchMap((result) => iif(() => result.isConfirmed, this.updateRequest(type, id, { status: 1 }))),
      tap(this.promptService.handleResponse('approveSuccessfully', callback))
    );
  }

  rejectRequest(type: RequestTypeAPIUrlPath, id: string, callback?: () => void): Observable<unknown> {
    return this.dialogService
      .open<UpdateRequestPayload>(new PolymorpheusComponent(RejectRequestDialogComponent, this.injector))
      .pipe(
        switchMap((payload) => this.updateRequest(type, id, payload)),
        tap(this.promptService.handleResponse('rejectSuccessfully', callback))
      );
  }

  cancelRequest(type: RequestTypeAPIUrlPath, id: string, callback?: () => void): Observable<unknown> {
    return from(
      this.promptService.open({
        icon: 'warning',
        showCancelButton: true,
        html: this.translocoService.translate('cancelRequestWarning'),
      } as SweetAlertOptions)
    ).pipe(
      switchMap((result) => iif(() => result.isConfirmed, this.updateRequest(type, id, { status: 2 }))),
      tap(this.promptService.handleResponse('cancelSuccessfully', callback))
    );
  }

  viewEmployeeRequestDetail(type: RequestTypeAPIUrlPath, id: string, userId?: string): Observable<unknown> {
    return this.getRequest(type, id).pipe(
      switchMap((res) =>
        this.dialogService.open(new PolymorpheusComponent(RequestDetailDialogComponent, this.injector), {
          data: {
            type,
            value: type === RequestTypeAPIUrlPath.leave ? parseLeaveDateRange(res.data) : res.data,
            userId,
          },
          required: true,
        })
      )
    );
  }

  getEscalateUsers(searchQuery: string): Observable<EmployeeInfo[]> {
    return this.http
      .get<BaseResponse<EmployeeInfo[]>>('/accountapp/v1.0/users/get-manager')
      .pipe(map((res) => res.data));
  }
}
