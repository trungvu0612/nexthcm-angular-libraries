import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import { AuthService } from '@nexthcm/auth';
import { JobTitlesQuery, loadJobTitles, PromptService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TRANSLOCO_SCOPE, TranslocoScope } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { takeUntil } from 'rxjs/operators';
import { AdminLeaveConfigsService } from '../../admin-leave-configs.service';
import { LeaveConfigUrlPaths } from '../../models/leave-config-url-paths';
import { LeaveLevelApproval } from '../../models/leave-level-approval';
import { LeaveTypesQuery, loadLeaveTypes } from '../../state';

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
      key: 'leaveTypes',
      type: 'multi-select',
      templateOptions: {
        translate: true,
        label: 'leaveTypes',
        labelClassName: 'font-semibold',
        placeholder: 'chooseLeaveTypes',
        required: true,
        options: this.leaveTypesQuery.selectAll(),
        labelProp: 'name',
        matcherBy: 'id',
        translocoScope: this.scope,
      },
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
        label: 'approvalDays',
        labelClassName: 'font-semibold',
        placeholder: 'enterDays',
        textfieldLabelOutside: true,
        precision: 0,
        min: 1,
        translocoScope: this.scope,
      },
    },
    { key: 'id' },
    { key: 'tenantId', defaultValue: this.authService.get('userInfo', 'tenantId') },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, LeaveLevelApproval>,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly leaveConfigsService: AdminLeaveConfigsService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly jobTitlesQuery: JobTitlesQuery,
    private readonly leaveTypesQuery: LeaveTypesQuery,
    actions: Actions
  ) {
    actions.dispatch(loadJobTitles());
    actions.dispatch(loadLeaveTypes());
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
      this.leaveConfigsService
        .upsert(this.leaveConfigAPIUrlPath, formModel)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          this.promptService.handleResponse(
            formModel.id
              ? 'leaveConfigs.editLeaveLevelApprovalSuccessfully'
              : 'leaveConfigs.createLeaveLevelApprovalSuccessfully',
            () => this.context.completeWith(true)
          )
        );
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
