import { HttpParams } from '@angular/common/http';
import { Directive, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewAbstractServerSortPaginationTableComponent, Pagination, PromptService, WorkflowStatus } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { EMPTY, from, iif, Subject } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';
import { RequestTypeUrlPaths } from '../models';
import { MyRequestsService, RequestDetailDialogService } from '../services';

@Directive()
export abstract class AbstractRequestListComponent<T>
  extends NewAbstractServerSortPaginationTableComponent<T>
  implements OnInit
{
  abstract requestTypeUrlPath: keyof RequestTypeUrlPaths;
  abstract myRequestsService: MyRequestsService;
  abstract requestDetailDialogService: RequestDetailDialogService;
  abstract promptService: PromptService;
  abstract translocoService: TranslocoService;

  // EVENTS
  readonly viewRequestDetail$ = new Subject<[string, string | undefined]>();
  readonly changeStatus$ = new Subject<[string, WorkflowStatus]>();

  // HANDLERS
  readonly changeStatusHandler$ = this.changeStatus$.pipe(
    switchMap(([requestId, { id, name }]) =>
      from(
        this.promptService.open({
          icon: 'question',
          html: this.translocoService.translate('changeWorkflowStatus', { name }),
          showCancelButton: true,
        })
      ).pipe(
        switchMap((result) =>
          iif(
            () => result.isConfirmed,
            this.myRequestsService.changeRequestStatus(this.requestTypeUrlPath, requestId, id).pipe(
              tap(() => this.fetch$.next()),
              startWith(null)
            ),
            EMPTY
          )
        )
      )
    )
  );
  readonly viewRequestDetailHandler$ = this.viewRequestDetail$.pipe(
    switchMap(([id, userId]) => this.requestDetailDialogService.viewRequestDetail(this.requestTypeUrlPath, id, userId)),
    tap(() => this.setQueryParams('id', null))
  );

  protected constructor(readonly state: RxState<Pagination<T>>, readonly activatedRoute: ActivatedRoute) {
    super(state, activatedRoute);
    state.hold(this.viewRequestDetailHandler$);
  }

  get requestId(): string | null {
    return this.activatedRoute.snapshot.queryParamMap.get('id');
  }

  ngOnInit(): void {
    if (this.requestId) {
      this.viewRequestDetail$.next([this.requestId, undefined]);
    }
  }

  onViewEmployeeRequestDetail(id: string, userId?: string): void {
    this.setQueryParams('id', id);
    this.viewRequestDetail$.next([id, userId]);
  }

  onFilter(httpParams: HttpParams): void {
    this.queryParams = httpParams;
    this.fetch$.next();
  }
}
