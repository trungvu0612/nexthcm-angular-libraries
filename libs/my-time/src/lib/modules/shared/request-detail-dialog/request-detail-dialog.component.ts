import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule } from '@angular/core';
import { GetFilePipeModule } from '@nexthcm/cdk';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiDialogContext } from '@taiga-ui/core';
import { TuiAccordionModule, TuiAvatarModule, TuiLazyLoadingModule, TuiTagModule } from '@taiga-ui/kit';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { takeUntil } from 'rxjs/operators';
import { RequestStatus } from '../../../enums';
import { GeneralRequest } from '../../../models/interfaces/general-request';
import { MyTimeService, RequestTypeAPIUrlPath } from '../../../services';

@Component({
  selector: 'hcm-request-detail-dialog',
  templateUrl: './request-detail-dialog.component.html',
  styleUrls: ['./request-detail-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class RequestDetailDialogComponent {
  readonly RequestStatus = RequestStatus;
  readonly RequestTypeAPIUrlPath = RequestTypeAPIUrlPath;

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    public context: TuiDialogContext<unknown, { type: RequestTypeAPIUrlPath; value: GeneralRequest; userId?: string }>,
    private myTimeService: MyTimeService,
    private destroy$: TuiDestroyService
  ) {}

  get data(): GeneralRequest {
    return this.context.data.value;
  }

  get requestTypeAPIUrlPath(): RequestTypeAPIUrlPath {
    return this.context.data.type;
  }

  get isMyRequest(): boolean {
    return !!this.context.data.userId;
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

  onCancelRequest(idLeave: string): void {
    this.myTimeService
      .cancelRequest(this.requestTypeAPIUrlPath, idLeave)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.context.data.value.status = RequestStatus.cancelled));
  }
}

@NgModule({
  declarations: [RequestDetailDialogComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    GetFilePipeModule,
    TuiTagModule,
    TuiLazyLoadingModule,
    TuiAvatarModule,
    TranslocoLocaleModule,
    TuiButtonModule,
    TuiAccordionModule,
  ],
  exports: [RequestDetailDialogComponent],
})
export class RequestDetailDialogComponentModule {}
