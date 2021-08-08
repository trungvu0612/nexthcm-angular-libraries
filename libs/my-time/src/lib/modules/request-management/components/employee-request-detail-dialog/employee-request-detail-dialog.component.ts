import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { takeUntil } from 'rxjs/operators';
import { RequestStatus } from '../../../../enums';
import { GeneralRequest } from '../../../../models/interfaces/general-request';
import { MyTimeService, RequestTypeAPIUrlPath } from '../../../../services/my-time.service';

@Component({
  selector: 'hcm-employee-request-detail-dialog',
  templateUrl: './employee-request-detail-dialog.component.html',
  styleUrls: ['./employee-request-detail-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class EmployeeRequestDetailDialogComponent {
  readonly RequestStatus = RequestStatus;
  readonly RequestTypeAPIUrlPath = RequestTypeAPIUrlPath;

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    public context: TuiDialogContext<unknown, { type: RequestTypeAPIUrlPath; value: GeneralRequest }>,
    private myTimeService: MyTimeService,
    private destroy$: TuiDestroyService
  ) {}

  get data(): GeneralRequest {
    return this.context.data.value;
  }

  get requestTypeAPIUrlPath(): RequestTypeAPIUrlPath {
    return this.context.data.type;
  }

  onApproveRequest(id: string): void {
    this.myTimeService
      .approveRequest(this.requestTypeAPIUrlPath, id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.context.data.value.status = RequestStatus.approved));
  }

  onRejectRequest(id: string): void {
    this.myTimeService
      .rejectRequest(this.requestTypeAPIUrlPath, id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.context.data.value.status = RequestStatus.rejected));
  }
}
