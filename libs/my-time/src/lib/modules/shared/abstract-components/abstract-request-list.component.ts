import { AbstractServerPaginationTableComponent, Pagination } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { takeUntil } from 'rxjs/operators';
import { RequestStatus } from '../../../enums';
import { MyTimeService, RequestTypeAPIUrlPath } from '../../../services';

export abstract class AbstractRequestListComponent<T> extends AbstractServerPaginationTableComponent<T> {
  requestTypeUrlPath!: RequestTypeAPIUrlPath;
  myTimeService!: MyTimeService;
  destroy$!: TuiDestroyService;
  readonly RequestStatus = RequestStatus;

  protected constructor(public state: RxState<Pagination<T>>) {
    super(state);
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

  onApproveRequest(id: string): void {
    this.myTimeService
      .approveRequest(this.requestTypeUrlPath, id, () => this.queryParams$.next(this.queryParams$.value))
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  onRejectRequest(id: string): void {
    this.myTimeService
      .rejectRequest(this.requestTypeUrlPath, id, () => this.queryParams$.next(this.queryParams$.value))
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  onCancelRequest(id: string): void {
    this.myTimeService
      .cancelRequest(this.requestTypeUrlPath, id, () => this.queryParams$.next(this.queryParams$.value))
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }
}
