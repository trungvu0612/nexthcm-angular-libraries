import { AbstractServerPaginationTableComponent, Pagination } from '@nexthcm/cdk';
import { RxState } from '@rx-angular/state';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { takeUntil } from 'rxjs/operators';
import { RequestStatus } from '../../../enums';
import { MyTimeService, RequestTypeUrlPath } from '../../../services/my-time.service';

export abstract class AbstractRequestListComponent<T> extends AbstractServerPaginationTableComponent<T> {
  requestTypeUrlPath!: RequestTypeUrlPath;
  myTimeService!: MyTimeService;
  destroy$!: TuiDestroyService;
  readonly RequestStatus = RequestStatus;

  protected constructor(public state: RxState<Pagination<T>>) {
    super(state);
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
}
