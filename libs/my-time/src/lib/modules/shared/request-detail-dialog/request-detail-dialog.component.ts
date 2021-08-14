import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EmployeeInfo, GetFilePipeModule } from '@nexthcm/cdk';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { TuiDestroyService, TuiIdentityMatcher, TuiLetModule, TuiStringHandler } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiDataListModule, TuiDialogContext, TuiTextfieldControllerModule } from '@taiga-ui/core';
import {
  TuiAccordionModule,
  TuiAvatarModule,
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiHighlightModule,
  TuiLazyLoadingModule,
  TuiTagModule,
} from '@taiga-ui/kit';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { RequestStatus } from '../../../enums';
import { GeneralRequest } from '../../../models';
import { MyTimeService, RequestTypeAPIUrlPath } from '../../../services';
import { LeaveRequestDateRangeComponentModule } from '../leave-request-date-range/leave-request-date-range.component';

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
  readonly search$ = new BehaviorSubject<string>('');
  readonly items$: Observable<EmployeeInfo[]> = this.search$.pipe(
    filter((search) => !!search),
    switchMap((search) => this.myTimeService.getEscalateUsers(search))
  );

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    readonly context: TuiDialogContext<
      unknown,
      { type: RequestTypeAPIUrlPath; value: GeneralRequest; userId?: string }
    >,
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

  readonly identityMatcher: TuiIdentityMatcher<any> = (item1: EmployeeInfo, item2: EmployeeInfo) =>
    item1.id === item2.id;

  readonly stringify: TuiStringHandler<any> = (item: EmployeeInfo) => item.fullName;

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

  onCancelRequest(id: string): void {
    this.myTimeService
      .cancelRequest(this.requestTypeAPIUrlPath, id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => (this.context.data.value.status = RequestStatus.cancelled));
  }

  onChangeEscalateUser(value: EmployeeInfo | null, requestId: string): void {
    if ('escalateInfo' in this.data) {
      this.data.escalateInfo = value;
    }
    if ('escalateInfo' in this.data) {
      this.data.escalateInfo = value;
    }
    if (value) {
      this.myTimeService
        .updateRequest(this.requestTypeAPIUrlPath, requestId, { escalate: value.id })
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }
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
    TuiComboBoxModule,
    TuiDataListWrapperModule,
    TuiLetModule,
    TuiDataListModule,
    TuiHighlightModule,
    FormsModule,
    TuiTextfieldControllerModule,
    LeaveRequestDateRangeComponentModule,
  ],
  exports: [RequestDetailDialogComponent],
})
export class RequestDetailDialogComponentModule {}
