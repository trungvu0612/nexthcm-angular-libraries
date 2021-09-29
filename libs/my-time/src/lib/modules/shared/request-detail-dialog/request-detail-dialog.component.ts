import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@nexthcm/auth';
import { EmployeeInfo, GetFilePipeModule } from '@nexthcm/cdk';
import { AvatarComponentModule } from '@nexthcm/ui';
import { FormControl } from '@ngneat/reactive-forms';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { RxState } from '@rx-angular/state';
import { TuiDestroyService, TuiIdentityMatcher, TuiLetModule, TuiStringHandler } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDialogContext,
  TuiDropdownControllerModule,
  TuiHostedDropdownComponent,
  TuiHostedDropdownModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiAccordionModule,
  TuiAvatarModule,
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiHighlightModule,
  TuiInputModule,
  TuiSelectModule,
  TuiTagModule,
} from '@taiga-ui/kit';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { RequestStatus } from '../../../enums';
import { GeneralRequest } from '../../../models';
import { RequestComment } from '../../../models/request-comment';
import { RequestTypeUrlPath } from '../../../models/request-type-url-path';
import { Tracking } from '../../../models/requests/tracking';
import { MyTimeService } from '../../../services';
import { LeaveRequestDateRangeComponentModule } from '../leave-request-date-range/leave-request-date-range.component';

interface ComponentState {
  history: Tracking[];
  comments: RequestComment[];
}

@Component({
  selector: 'hcm-request-detail-dialog',
  templateUrl: './request-detail-dialog.component.html',
  styleUrls: ['./request-detail-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class RequestDetailDialogComponent implements OnInit {
  @ViewChild(TuiHostedDropdownComponent) component?: TuiHostedDropdownComponent;

  readonly RequestStatus = RequestStatus;
  readonly search$ = new BehaviorSubject<string>('');
  readonly users: Observable<EmployeeInfo[]> = this.search$.pipe(
    filter((search) => !!search),
    switchMap((search) => this.myTimeService.getEscalateUsers(search))
  );
  readonly commentControl = new FormControl<string>();
  open = false;

  // READS
  readonly history$ = this.state.select('history');
  readonly comments$ = this.state.select('comments');

  // EVENTS
  readonly getComments$ = new Subject();
  readonly getHistory$ = new Subject();

  // HANDLERS
  readonly getCommentsHandler$ = this.getComments$.pipe(
    switchMap(() => this.myTimeService.getRequestComments(this.requestType, this.data.id))
  );
  readonly getHistoryHandler$ = this.getHistory$.pipe(
    switchMap(() => this.myTimeService.getRequestHistory(this.requestType, this.data.id))
  );

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    readonly context: TuiDialogContext<
      unknown,
      { type: keyof RequestTypeUrlPath; value: GeneralRequest; userId?: string }
    >,
    private myTimeService: MyTimeService,
    private authService: AuthService,
    private destroy$: TuiDestroyService,
    private readonly state: RxState<ComponentState>
  ) {
    state.connect('history', this.getHistoryHandler$);
    state.connect('comments', this.getCommentsHandler$);
  }

  get data(): GeneralRequest {
    return this.context.data.value;
  }

  get requestType(): keyof RequestTypeUrlPath {
    return this.context.data.type;
  }

  get isMyRequest(): boolean {
    return !!this.context.data.userId;
  }

  readonly identityMatcher: TuiIdentityMatcher<any> = (item1: EmployeeInfo, item2: EmployeeInfo) =>
    item1.id === item2.id;

  readonly stringify: TuiStringHandler<any> = (item: EmployeeInfo) => item.fullName;

  ngOnInit(): void {
    this.getHistory$.next();
  }

  onChangeEscalateUser(value: EmployeeInfo | null, requestId: string): void {
    if ('escalateInfo' in this.data) {
      this.data.escalateInfo = value;
    }
    if (value?.id) {
      this.myTimeService
        .changeEscalateUser(this.requestType, { objectId: requestId, escalateId: value.id })
        .pipe(takeUntil(this.destroy$))
        .subscribe();
    }
  }

  onSubmitComment(): void {
    const comment: RequestComment = {
      comment: this.commentControl.value,
      // type: this.requestTypeComment + '',
      objectId: this.context.data.value.id,
    };

    this.myTimeService.submitRequestComment(comment).subscribe(() => {
      // this.commentParams$.next(this.commentParams$.value);
      this.commentControl.reset();
    });
  }

  onChangeRequestStatus(statusId: string): void {
    this.open = false;
    this.component?.nativeFocusableElement?.focus();
    this.myTimeService
      .changeRequestStatus(this.requestType, this.data.id, statusId)
      .pipe(takeUntil(this.destroy$))
      .subscribe();
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
    TuiSelectModule,
    TuiHostedDropdownModule,
    TuiDropdownControllerModule,
    TuiSvgModule,
  ],
  exports: [RequestDetailDialogComponent],
})
export class RequestDetailDialogComponentModule {}
