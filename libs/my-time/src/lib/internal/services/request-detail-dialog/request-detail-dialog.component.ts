import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@nexthcm/auth';
import { EmployeeInfo, PromptService, WorkflowStatus } from '@nexthcm/cdk';
import { AvatarComponentModule } from '@nexthcm/ui';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { LetModule, PushModule } from '@rx-angular/template';
import { isPresent, TuiDestroyService, TuiIdentityMatcher, TuiLetModule, TuiStringHandler } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDialogContext,
  TuiDropdownControllerModule,
  TuiHintModule,
  TuiHostedDropdownComponent,
  TuiHostedDropdownModule,
  TuiLoaderModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiAccordionModule,
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiHighlightModule,
  TuiInputModule,
  TuiSelectModule,
  TuiTagModule,
} from '@taiga-ui/kit';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { combineLatest, EMPTY, from, iif, of, Subject } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

import { LeaveRequestDateRangeComponentModule } from '../../../shared';
import { REQUEST_COMMENT_URL_PATHS } from '../../constants';
import { RequestCommentStatus } from '../../enums';
import { GeneralRequest, HistoryItem, RequestComment, RequestTypeUrlPaths } from '../../models';
import { MyRequestsService } from '../my-requests.service';

interface ComponentState {
  data: GeneralRequest;
  history: HistoryItem[];
  comments: RequestComment[];
  directSupervisor: EmployeeInfo | null;
}

interface RequestCommentForm extends RequestComment {
  userInfo: EmployeeInfo;
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

  readonly escalateUsers$ = this.myRequestsService.getEscalateUsers(this.requestType, this.requestId);
  open = false;
  inputComment = false;
  readonly RequestCommentStatus = RequestCommentStatus;
  commentModel = {} as RequestCommentForm;
  readonly commentForm = this.fb.group(this.commentModel);
  commentFields: FormlyFieldConfig[] = [
    { key: 'comment', type: 'mention-editor', templateOptions: { required: true } },
    { key: 'id' },
    { key: 'objectId', defaultValue: this.requestId },
    { key: 'type', defaultValue: REQUEST_COMMENT_URL_PATHS[this.requestType] },
    { key: 'state', defaultValue: RequestCommentStatus.Active },
  ];

  // READS

  readonly data$ = this.state.select('data');
  readonly directSupervisor$ = this.state.select('directSupervisor');
  readonly history$ = this.state.select('history');
  readonly comments$ = this.state.select('comments');

  // EVENTS

  readonly fetch$ = new Subject<void>();
  readonly getComments$ = new Subject<void>();
  readonly getHistory$ = new Subject<void>();
  readonly changeEscalateUser$ = new Subject<EmployeeInfo>();
  readonly submitComment$ = new Subject<RequestComment>();
  readonly changeStatus$ = new Subject<WorkflowStatus>();

  // HANDLERS

  readonly request$ = this.fetch$.pipe(
    switchMap(() => this.myRequestsService.getRequest(this.requestType, this.requestId).pipe(startWith(null))),
    shareReplay(1)
  );
  readonly getCommentsHandler$ = this.getComments$.pipe(
    switchMap(() => this.myRequestsService.getRequestComments(this.requestType, this.requestId))
  );
  readonly getHistoryHandler$ = this.getHistory$.pipe(
    switchMap(() => this.myRequestsService.getRequestHistory(this.requestType, this.requestId))
  );
  readonly submitCommentHandler$ = this.submitComment$.pipe(
    switchMap((comment) =>
      iif(
        () => !!comment.id,
        this.myRequestsService.updateRequestComment(comment),
        this.myRequestsService.addRequestComment(comment)
      )
    ),
    tap(this.promptService.handleResponse('', () => this.getComments$.next()))
  );
  readonly changeStatusHandler$ = this.changeStatus$.pipe(
    switchMap(({ id, name }) =>
      from(
        this.promptService.open({
          icon: 'question',
          html: this.translocoService.translate('changeWorkflowStatus', { name }),
          showCancelButton: true,
        })
      ).pipe(
        switchMap((result) =>
          iif(
            () => result.isConfirmed,
            this.myRequestsService.changeRequestStatus(this.requestType, this.requestId, id).pipe(
              tap(
                this.promptService.handleResponse('', () => {
                  this.fetch$.next();
                  this.getHistory$.next();
                })
              ),
              startWith(null)
            ),
            EMPTY
          )
        )
      )
    )
  );
  readonly loading$ = combineLatest([this.request$, this.changeStatusHandler$.pipe(startWith({}))]).pipe(
    map((values) => values.includes(null)),
    catchError(() => of(false))
  );

  wordLimit = 80;
  showMore = false;

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<
      unknown,
      { type: keyof RequestTypeUrlPaths; value: string; userId?: string }
    >,
    private readonly myRequestsService: MyRequestsService,
    private readonly authService: AuthService,
    private readonly destroy$: TuiDestroyService,
    private readonly state: RxState<ComponentState>,
    private readonly fb: FormBuilder,
    private readonly promptService: PromptService,
    private readonly translocoService: TranslocoService
  ) {
    state.connect('data', this.request$.pipe(filter(isPresent)));
    state.connect(
      'directSupervisor',
      this.request$.pipe(
        filter(isPresent),
        filter(() => this.requestType === 'leave'),
        switchMap((data) =>
          this.myRequestsService.getLeaveEscalationUser(this.requestId, (data.escalateDTO || data.escalateInfo)?.id)
        )
      )
    );
    state.connect('history', this.getHistoryHandler$);
    state.connect(
      'comments',
      this.getCommentsHandler$.pipe(
        tap(() => {
          this.inputComment = false;
          this.commentModel = { ...this.commentModel, id: '', comment: '' };
        })
      )
    );
    state.hold(this.submitCommentHandler$);
    state.hold(
      this.changeEscalateUser$.pipe(
        switchMap((user) =>
          this.myRequestsService.changeEscalateUser(this.requestType, {
            objectId: this.requestId,
            escalateId: user.id,
          })
        ),
        tap(
          this.promptService.handleResponse('', () => {
            this.fetch$.next();
            this.getHistory$.next();
          })
        )
      )
    );
  }

  get requestId(): string {
    return this.context.data.value;
  }

  get requestType(): keyof RequestTypeUrlPaths {
    return this.context.data.type;
  }

  get isMyRequest(): boolean {
    return !!this.context.data.userId;
  }

  get currentUserId(): string {
    return this.authService.get('userInfo', 'userId');
  }

  readonly identityMatcher: TuiIdentityMatcher<EmployeeInfo> = (item1, item2) => item1.id === item2.id;

  readonly stringify: TuiStringHandler<EmployeeInfo> = ({ fullName }) => fullName;

  ngOnInit(): void {
    this.fetch$.next();
    this.getHistory$.next();
    this.getComments$.next();
  }

  onChangeEscalateUser(value: EmployeeInfo | null): void {
    if (value) {
      this.changeEscalateUser$.next(value);
    }
  }

  onUpsertComment(comment?: RequestComment): void {
    this.inputComment = true;
    this.commentModel = { ...this.commentModel, ...(comment as RequestCommentForm) };
  }

  onRemoveComment(comment: RequestComment): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate('deleteComment'),
        showCancelButton: true,
      })
    )
      .pipe(
        switchMap((result) =>
          iif(
            () => result.isConfirmed,
            this.myRequestsService.updateRequestComment({ ...comment, state: RequestCommentStatus.Deleted }),
            EMPTY
          )
        ),
        tap(this.promptService.handleResponse('', () => this.getComments$.next())),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  onSubmitComment(): void {
    this.submitComment$.next(this.commentForm.value);
  }

  onCancelComment(): void {
    this.inputComment = false;
    this.commentForm.controls['comment'].reset();
  }

  onChangeRequestStatus(status: WorkflowStatus): void {
    this.open = false;
    this.component?.nativeFocusableElement?.focus();
    this.changeStatus$.next(status);
  }
}

@NgModule({
  declarations: [RequestDetailDialogComponent],
  imports: [
    CommonModule,
    TranslocoModule,
    TuiTagModule,
    AvatarComponentModule,
    TranslocoLocaleModule,
    TuiButtonModule,
    TuiAccordionModule,
    TuiComboBoxModule,
    TuiInputModule,
    FormsModule,
    TuiDataListWrapperModule,
    TuiLetModule,
    TuiDataListModule,
    FormsModule,
    TuiTextfieldControllerModule,
    TuiHostedDropdownModule,
    TuiDropdownControllerModule,
    TuiSvgModule,
    TuiHighlightModule,
    FormlyModule,
    TuiSelectModule,
    LeaveRequestDateRangeComponentModule,
    LetModule,
    TuiLoaderModule,
    PushModule,
    TuiHintModule,
    ReactiveFormsModule,
  ],
  exports: [RequestDetailDialogComponent],
})
export class RequestDetailDialogComponentModule {}
