import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Pagination, PagingResponse, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { from, iif, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { TrackingHistory, UpdateRequestPayload } from '../models';
import { RejectRequestDialogComponent } from '../modules/request-management/components/reject-leave-request-dialog/reject-request-dialog.component';

const MY_TIME_PATH = '/mytimeapp/v1.0';

export enum RequestTypeUrlPath {
  leave = 'leaves',
  workingAfterHours = 'ot-requests',
  updateTimeSheet = 'timesheet-updates',
  workingOutside = 'outside',
  workFromHome = 'wfh',
}

@Injectable({
  providedIn: 'root',
})
export class MyTimeService {
  constructor(
    private http: HttpClient,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private promptService: PromptService,
    private translocoService: TranslocoService
  ) {}

  getTrackingHistory(id?: string): Observable<TrackingHistory[]> {
    return this.http.get<TrackingHistory[]>(`${MY_TIME_PATH}/leaves/tracking-history/${id}`);
  }

  getRequests<T>(type: RequestTypeUrlPath, params: HttpParams): Observable<Pagination<T>> {
    return this.http.get<PagingResponse<T>>(`${MY_TIME_PATH}/${type}`, { params }).pipe(map((res) => res.data));
  }

  updateRequest(type: RequestTypeUrlPath, id: string, payload: UpdateRequestPayload): Observable<unknown> {
    return this.http.put<unknown>(`${MY_TIME_PATH}/${type}/${id}`, payload);
  }

  approveRequest(type: RequestTypeUrlPath, id: string, callback: () => void): Observable<unknown> {
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

  rejectRequest(type: RequestTypeUrlPath, id: string, callback: () => void): Observable<unknown> {
    return this.dialogService
      .open<UpdateRequestPayload>(new PolymorpheusComponent(RejectRequestDialogComponent, this.injector))
      .pipe(
        switchMap((payload) => this.updateRequest(type, id, payload)),
        tap(this.promptService.handleResponse('rejectSuccessfully', callback))
      );
  }
}
