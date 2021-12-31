import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import { AuthService } from '@nexthcm/auth';
import { JobTitlesQuery, loadJobTitles, PromptService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { of, Subject } from 'rxjs';
import { catchError, map, share, startWith, switchMap, tap } from 'rxjs/operators';
import { AdminLeaveConfigsService } from '../../admin-leave-configs.service';
import { LeaveConfigUrlPaths, LeaveLevelApproval } from '../../models';
import { TRANSLATION_SCOPE } from '../../translation-scope';

@Component({
  selector: 'hcm-upsert-leave-approval-level-dialog',
  templateUrl: './upsert-leave-approval-level-dialog.component.html',
  styleUrls: ['./upsert-leave-approval-level-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UpsertLeaveApprovalLevelDialogComponent implements OnInit {
  readonly leaveConfigAPIUrlPath: keyof LeaveConfigUrlPaths = 'leaveLevelApproval';
  form = this.fb.group<LeaveLevelApproval>({} as LeaveLevelApproval);
  model = {} as LeaveLevelApproval;
  fields: FormlyFieldConfig[] = [
    {
      key: 'leaveType',
      className: 'tui-form__row block',
      type: 'combo-box',
      templateOptions: {
        translate: true,
        label: 'leaveType',
        labelClassName: 'font-semibold',
        placeholder: 'searchLeaveTypes',
        required: true,
        textfieldLabelOutside: true,
        serverRequest: (searchQuery: string) => this.leaveConfigsService.searchLeaveTypes(searchQuery),
        matcherBy: 'id',
      },
      hideExpression: '!model.id',
    },
    {
      key: 'leaveTypes',
      className: 'tui-form__row block',
      type: 'multi-select-search',
      templateOptions: {
        translate: true,
        label: 'leaveTypes',
        labelClassName: 'font-semibold',
        textfieldLabelOutside: true,
        placeholder: 'searchLeaveTypes',
        required: true,
        labelProp: 'name',
        matcherBy: 'id',
        serverRequest: (searchQuery: string) => this.leaveConfigsService.searchLeaveTypes(searchQuery),
      },
      hideExpression: 'model.id',
    },
    {
      key: 'jobTitleDTOList',
      className: 'tui-form__row block',
      type: 'multi-select-search',
      templateOptions: {
        translate: true,
        label: 'jobTitles',
        labelClassName: 'font-semibold',
        textfieldLabelOutside: true,
        placeholder: 'searchJobTitles',
        required: true,
        serverRequest: (searchQuery: string) => this.jobTitlesQuery.searchJobTitles(searchQuery),
      },
    },
    {
      className: 'tui-form__row block',
      key: 'totalLeave',
      type: 'input-number',
      templateOptions: {
        required: true,
        translate: true,
        label: `${TRANSLATION_SCOPE}.approvalDays`,
        labelClassName: 'font-semibold',
        placeholder: `${TRANSLATION_SCOPE}.enterDays`,
        textfieldLabelOutside: true,
        precision: 0,
        min: 1,
      },
    },
    { key: 'id' },
    { key: 'tenantId', defaultValue: this.authService.get('userInfo', 'tenantId') },
  ];
  readonly submit$ = new Subject<LeaveLevelApproval>();
  readonly submitHandler$ = this.submit$.pipe(
    switchMap((payload) =>
      this.leaveConfigsService.upsert(this.leaveConfigAPIUrlPath, payload).pipe(
        tap(
          this.promptService.handleResponse(
            payload.id
              ? 'leaveConfigs.editLeaveLevelApprovalSuccessfully'
              : 'leaveConfigs.createLeaveLevelApprovalSuccessfully',
            () => this.context.completeWith(true)
          )
        ),
        catchError(() => of({})),
        startWith(null)
      )
    ),
    share()
  );
  readonly submitLoading$ = this.submitHandler$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, LeaveLevelApproval>,
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly leaveConfigsService: AdminLeaveConfigsService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly jobTitlesQuery: JobTitlesQuery,
    actions: Actions
  ) {
    actions.dispatch(loadJobTitles());
  }

  ngOnInit(): void {
    if (this.context.data) {
      this.model = { ...this.model, ...this.context.data };
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };

      formModel.jobTitle = formModel.jobTitleDTOList.map((jobTitle) => jobTitle.id);
      this.submit$.next(formModel);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
