import { ActivatedRoute } from '@angular/router';
import { NewAbstractServerSortPaginationTableComponent, Pagination } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { Subject } from 'rxjs';
import { startWith, switchMap, tap } from 'rxjs/operators';
import { RequestTypeUrlPaths } from '../models';
import { MyRequestsService } from '../services';

export abstract class NewAbstractRequestListComponent<T> extends NewAbstractServerSortPaginationTableComponent<T> {
  abstract requestTypeUrlPath: keyof RequestTypeUrlPaths;
  abstract myRequestsService: MyRequestsService;

  // EVENTS
  readonly viewRequestDetail$ = new Subject<[string, string | undefined]>();
  readonly changeStatus$ = new Subject<[string, string]>();

  // HANDLERS
  readonly changeStatusHandler$ = this.changeStatus$.pipe(
    switchMap(([requestId, statusId]) =>
      this.myRequestsService.changeRequestStatus(this.requestTypeUrlPath, requestId, statusId).pipe(
        tap(() => this.fetch$.next()),
        startWith(null)
      )
    )
  );
  readonly viewRequestDetailHandler$ = this.viewRequestDetail$.pipe(
    switchMap(([id, userId]) => this.myRequestsService.viewRequestDetail(this.requestTypeUrlPath, id, userId)),
    tap(() => this.fetch$.next())
  );

  protected constructor(readonly state: RxState<Pagination<T>>, readonly activatedRoute: ActivatedRoute) {
    super(state, activatedRoute);
    state.hold(this.viewRequestDetailHandler$);
  }

  onViewEmployeeRequestDetail(id: string, userId?: string): void {
    this.viewRequestDetail$.next([id, userId]);
  }
}
