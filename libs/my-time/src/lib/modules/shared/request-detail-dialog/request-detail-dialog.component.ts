import { CommonModule } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@nexthcm/auth';
import { EmployeeInfo, GetFilePipeModule, Pagination } from '@nexthcm/cdk';
import { AvatarComponentModule } from '@nexthcm/ui';
import { FormControl } from '@ngneat/reactive-forms';
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
  TuiInputModule,
  TuiTagModule,
} from '@taiga-ui/kit';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { RequestStatus } from '../../../enums';
import { GeneralRequest } from '../../../models';
import { RequestComment } from '../../../models/request-comment';
import { Tracking } from '../../../models/requests/tracking';
import { MyTimeService, RequestTypeAPIUrlPath, RequestTypeComment } from '../../../services';
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
  readonly commentControl = new FormControl<string>();
  readonly commentParams$ = new BehaviorSubject(
    new HttpParams()
      .set('page', 0)
      .set('size', 6666)
      .set('type', this.requestType)
      .set('objectId', this.context.data.value.id)
  );

  readonly comments$: Observable<Pagination<RequestComment>> = this.commentParams$.pipe(
    switchMap(() => this.myTimeService.getRequestComment(this.commentParams$.value))
  );

  readonly tracking$: Observable<Tracking[]> = this.commentParams$.pipe(
    switchMap(() => this.myTimeService.getRequestTracking(this.requestTypeAPIUrlPath, this.context.data.value.id))
  );

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    readonly context: TuiDialogContext<
      unknown,
      { type: RequestTypeAPIUrlPath; value: GeneralRequest; userId?: string }
    >,
    private myTimeService: MyTimeService,
    private authService: AuthService,
    private destroy$: TuiDestroyService
  ) {}

  get data(): GeneralRequest {
    return this.context.data.value;
  }

  get requestTypeAPIUrlPath(): RequestTypeAPIUrlPath {
    return this.context.data.type;
  }

  get requestType(): RequestTypeComment {
    const key = RequestTypeAPIUrlPath[this.context.data.type] as keyof typeof RequestTypeComment;
    return RequestTypeComment[key];
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
    if (value) {
      this.myTimeService
        .updateRequest(this.requestTypeAPIUrlPath, requestId, { escalate: value.id })
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  }

  onSubmitComment(): void {
    const comment: RequestComment = {
      comment: this.commentControl.value,
      type: this.requestType + '',
      objectId: this.context.data.value.id,
    };

    this.myTimeService.submitReqComment(comment).subscribe(() => {
      this.commentParams$.next(this.commentParams$.value);
      this.commentControl.reset();
    });
  }
}

@NgModule({
  declarations: [RequestDetailDialogComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    GetFilePipeModule,
    TuiTagModule,
    AvatarComponentModule,
    TranslocoLocaleModule,
    TuiButtonModule,
    TuiAccordionModule,
    TuiComboBoxModule,
    TuiInputModule,
    FormsModule,
    ReactiveFormsModule,
    TuiDataListWrapperModule,
    TuiLetModule,
    TuiDataListModule,
    TuiHighlightModule,
    FormsModule,
    TuiTextfieldControllerModule,
    LeaveRequestDateRangeComponentModule,
    TuiAvatarModule,
  ],
  exports: [RequestDetailDialogComponent],
})
export class RequestDetailDialogComponentModule {}
