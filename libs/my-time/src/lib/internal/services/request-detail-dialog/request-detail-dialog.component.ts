import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@nexthcm/auth';
import { EmployeeInfo, PromptService } from '@nexthcm/cdk';
import { AvatarComponentModule } from '@nexthcm/ui';
import { Control, FormBuilder, NgStackFormsModule } from '@ng-stack/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { FormlyFieldConfig, FormlyModule } from '@ngx-formly/core';
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
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiHighlightModule,
  TuiInputModule,
  TuiSelectModule,
  TuiTagModule,
} from '@taiga-ui/kit';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { EMPTY, from, iif, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { REQUEST_COMMENT_URL_PATHS } from '../../constants';
import { RequestCommentStatus } from '../../enums';
import { GeneralRequest, HistoryItem, RequestComment, RequestTypeUrlPaths } from '../../models';
import { MyRequestsService } from '../my-requests.service';

interface ComponentState {
  history: HistoryItem[];
  comments: RequestComment[];
}

interface RequestCommentForm extends RequestComment {
  userInfo: Control<EmployeeInfo>;
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

  readonly escalateUsers$ = this.myRequestsService.getEscalateUsers(this.requestType, this.data.id);
  open = false;
  inputComment = false;
  readonly RequestCommentStatus = RequestCommentStatus;
  commentModel = {} as RequestCommentForm;
  readonly commentForm = this.fb.group<RequestCommentForm>(this.commentModel);
  commentFields: FormlyFieldConfig[] = [
    {
      key: 'comment',
      type: 'text-area',
      templateOptions: { textfieldLabelOutside: true, required: true },
    },
    { key: 'id' },
    { key: 'objectId', defaultValue: this.data.id },
    { key: 'type', defaultValue: REQUEST_COMMENT_URL_PATHS[this.requestType] },
    { key: 'state', defaultValue: RequestCommentStatus.Active },
  ];

  // READS
  readonly history$ = this.state.select('history');
  readonly comments$ = this.state.select('comments');

  // EVENTS
  readonly getComments$ = new Subject<void>();
  readonly getHistory$ = new Subject<void>();
  readonly changeEscalateUser$ = new Subject<EmployeeInfo>();
  readonly submitComment$ = new Subject<RequestComment>();

  // HANDLERS
  readonly getCommentsHandler$ = this.getComments$.pipe(
    switchMap(() => this.myRequestsService.getRequestComments(this.requestType, this.data.id))
  );
  readonly getHistoryHandler$ = this.getHistory$.pipe(
    switchMap(() => this.myRequestsService.getRequestHistory(this.requestType, this.data.id))
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

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<
      unknown,
      { type: keyof RequestTypeUrlPaths; value: GeneralRequest; userId?: string }
    >,
    private readonly myRequestsService: MyRequestsService,
    private readonly authService: AuthService,
    private readonly destroy$: TuiDestroyService,
    private readonly state: RxState<ComponentState>,
    private readonly fb: FormBuilder,
    private readonly promptService: PromptService,
    private readonly translocoService: TranslocoService
  ) {
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
          this.myRequestsService
            .changeEscalateUser(this.requestType, {
              objectId: this.data.id,
              escalateId: user.id,
            })
            .pipe(
              tap(() => {
                if ('escalateInfo' in this.data) {
                  this.data.escalateInfo = user;
                }
              })
            )
        )
      )
    );
  }

  get data(): GeneralRequest {
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

  readonly identityMatcher: TuiIdentityMatcher<any> = (item1: EmployeeInfo, item2: EmployeeInfo) =>
    item1.id === item2.id;

  readonly stringify: TuiStringHandler<any> = (item: EmployeeInfo) => item.fullName;

  ngOnInit(): void {
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
    this.commentForm.controls.comment.reset();
  }

  onChangeRequestStatus(statusId: string): void {
    this.open = false;
    this.component?.nativeFocusableElement?.focus();
    this.myRequestsService
      .changeRequestStatus(this.requestType, this.data.id, statusId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getHistory$.next());
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
    NgStackFormsModule,
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
  ],
  exports: [RequestDetailDialogComponent],
})
export class RequestDetailDialogComponentModule {}
