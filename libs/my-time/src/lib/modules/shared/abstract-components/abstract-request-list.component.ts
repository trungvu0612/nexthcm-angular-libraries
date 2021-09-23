import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { takeUntil } from 'rxjs/operators';
import { MyTimeService, RequestTypeAPIUrlPath } from '../../../services';

export abstract class AbstractRequestListComponent<T> extends AbstractServerSortPaginationTableComponent<T> {
  abstract requestTypeUrlPath: RequestTypeAPIUrlPath;
  abstract myTimeService: MyTimeService;
  abstract destroy$: TuiDestroyService;

  protected constructor(
    readonly state: RxState<Pagination<T>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute
  ) {
    super(state, router, activatedRoute);
  }

  onViewEmployeeRequestDetail(id: string, userId?: string): void {
    this.myTimeService
      .viewRequestDetail(this.requestTypeUrlPath, id, userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => null,
        () => this.queryParams$.next(this.queryParams$.value)
      );
  }

  onChangeRequestStatus(requestId: string, statusId: string): void {
    this.myTimeService
      .changeRequestStatus(this.requestTypeUrlPath, requestId, statusId, () =>
        this.queryParams$.next(this.queryParams$.value)
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
