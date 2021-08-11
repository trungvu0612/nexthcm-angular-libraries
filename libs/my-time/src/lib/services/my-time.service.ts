import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BaseResponse, Pagination, PagingResponse, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { from, iif, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { TrackingHistory, UpdateRequestPayload } from '../models';
import { GeneralRequest } from '../models/interfaces/general-request';
import { EmployeeRequestDetailDialogComponent } from '../modules/request-management/components/employee-request-detail-dialog/employee-request-detail-dialog.component';
import { RejectRequestDialogComponent } from '../modules/request-management/components/reject-leave-request-dialog/reject-request-dialog.component';
import { parseLeaveDateRange } from '../modules/shared/utils/parse-leave-date-range';
import { Tenant } from '../../../../admin/tenant/src/lib/models/tenant';

const MY_TIME_PATH = '/mytimeapp/v1.0';

export enum RequestTypeAPIUrlPath {
  leave = 'leaves' as any,
  workingAfterHours = 'ot-requests' as any,
  updateTimesheet = 'timesheet-updates' as any,
  workingOutside = 'outside' as any,
  workFromHome = 'wfh' as any,
}

@Injectable()
export class MyTimeService {
  constructor(
    private http: HttpClient,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private promptService: PromptService,
    private translocoService: TranslocoService
  ) {
  }

  getTrackingHistory(id?: string): Observable<TrackingHistory[]> {
    return this.http.get<TrackingHistory[]>(`${MY_TIME_PATH}/leaves/tracking-history/${id}`);
  }

  getRequests<T>(type: RequestTypeAPIUrlPath, params: HttpParams): Observable<Pagination<T>> {
    return this.http.get<PagingResponse<T>>(`${MY_TIME_PATH}/${type}`, { params }).pipe(map((res) => res.data));
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
        html: this.translocoService.translate('approveRequestWarning')
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
        html: this.translocoService.translate('cancelRequestWarning')
      } as SweetAlertOptions)
    ).pipe(
      switchMap((result) => iif(() => result.isConfirmed, this.updateRequest(type, id, { status: 2 }))),
      tap(this.promptService.handleResponse('cancelSuccessfully', callback))
    );
  }

  viewEmployeeRequestDetail(type: RequestTypeAPIUrlPath, id: string, userId?: string): Observable<unknown> {
    return this.getRequest(type, id).pipe(
      switchMap((res) =>
        this.dialogService.open(new PolymorpheusComponent(EmployeeRequestDetailDialogComponent, this.injector), {
          data: {
            type,
            value: type === RequestTypeAPIUrlPath.leave ? parseLeaveDateRange(res.data) : res.data,
            userId
          },
          required: true
        })
      )
    );
  }
}
