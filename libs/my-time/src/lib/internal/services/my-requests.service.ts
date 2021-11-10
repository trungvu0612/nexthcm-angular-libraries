import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BaseResponse, MY_TIME_API_PATH, Pagination, PagingResponse, PromptService } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { TranslocoDatePipe } from '@ngneat/transloco-locale';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { from, Observable, Subject } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { RequestDetailDialogComponent } from '../../shared/request-detail-dialog/request-detail-dialog.component';
import { REQUEST_DETAIL_URL_PATHS } from '../constants';
import { CombineRequestTypeUrlPaths, GeneralRequest, RequestTypeUrlPaths } from '../models';
import {
  LeaveDuplicated,
  SubmitLeaveRequestHttpErrorResponse,
} from '../models/requests/submit-leave-request-http-error-response';

@Injectable()
export class MyRequestsService {
  private refreshSubject = new Subject<keyof RequestTypeUrlPaths>();
  refresh$ = this.refreshSubject.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly promptService: PromptService,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly translocoService: TranslocoService,
    private readonly translocoDatePipe: TranslocoDatePipe
  ) {}

  getRequests<T>(type: keyof CombineRequestTypeUrlPaths, params: HttpParams): Observable<Pagination<T>> {
    return this.http
      .get<PagingResponse<T>>(`${MY_TIME_API_PATH}/${REQUEST_DETAIL_URL_PATHS[type]}`, { params })
      .pipe(map((res) => res.data));
  }

  submitRequest<T>(type: keyof RequestTypeUrlPaths, payload: T): Observable<unknown> {
    return this.http
      .post(`${MY_TIME_API_PATH}/${REQUEST_DETAIL_URL_PATHS[type]}`, payload)
      .pipe(tap(() => this.refreshSubject.next(type)));
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

  getRequest(type: keyof RequestTypeUrlPaths, id: string): Observable<BaseResponse<GeneralRequest>> {
    return this.http.get<BaseResponse<GeneralRequest>>(`${MY_TIME_API_PATH}/${REQUEST_DETAIL_URL_PATHS[type]}/${id}`);
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
