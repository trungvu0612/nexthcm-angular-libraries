import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { Subject } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';
import { RequestTypeUrlPaths } from '../../internal/models';
import { MyTimeService } from '../../services';

export abstract class AbstractRequestListComponent<T> extends AbstractServerSortPaginationTableComponent<T> {
  abstract requestTypeUrlPath: keyof RequestTypeUrlPaths;
  abstract myTimeService: MyTimeService;
  abstract destroy$: TuiDestroyService;

  // EVENTS
  readonly viewRequestDetail$ = new Subject<[string, string | undefined]>();
  readonly changeStatus$ = new Subject<[string, string]>();

  // HANDLERS
  readonly changeStatusHandler$ = this.changeStatus$.pipe(
    switchMap(([requestId, statusId]) =>
      this.myTimeService.changeRequestStatus(this.requestTypeUrlPath, requestId, statusId).pipe(
        tap(() => this.queryParams$.next(this.queryParams$.value)),
        startWith(null)
      )
    )
  );
  readonly viewRequestDetailHandler$ = this.viewRequestDetail$.pipe(
    switchMap(([id, userId]) => this.myTimeService.viewRequestDetail(this.requestTypeUrlPath, id, userId)),
    tap(() => this.queryParams$.next(this.queryParams$.value))
  );

  protected constructor(
    readonly state: RxState<Pagination<T>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute
  ) {
    super(state, router, activatedRoute);
    state.hold(this.viewRequestDetailHandler$);
  }

  onViewEmployeeRequestDetail(id: string, userId?: string): void {
    this.viewRequestDetail$.next([id, userId]);
  }
}
