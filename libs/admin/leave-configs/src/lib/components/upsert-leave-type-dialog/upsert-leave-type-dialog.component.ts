import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import { AuthService } from '@nexthcm/auth';
import { CommonStatus, loadWorkflows, PromptService, WorkflowsQuery } from '@nexthcm/cdk';
import { LeaveType } from '@nexthcm/my-time';
import { AbstractControl, FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { of } from 'rxjs';
import { debounceTime, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { AdminLeaveConfigsService } from '../../admin-leave-configs.service';
import { LeaveConfigUrlPaths } from '../../models/leave-config-url-paths';
import { TRANSLATION_SCOPE } from '../../translation-scope';

@Component({
  selector: 'hcm-upsert-leave-type-dialog',
  templateUrl: './upsert-leave-type-dialog.component.html',
  styleUrls: ['./upsert-leave-type-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UpsertLeaveTypeDialogComponent implements OnInit {
  readonly leaveConfigAPIUrlPath: keyof LeaveConfigUrlPaths = 'leaveType';
  form = this.fb.group<LeaveType>({} as LeaveType);
  model = {} as LeaveType;
  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      className: 'tui-form__row block',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'name',
        labelClassName: 'font-semibold',
        placeholder: 'enterName',
        textfieldLabelOutside: true,
      },
      asyncValidators: {
        name: {
          expression: (control: AbstractControl<string>) =>
            !control.valueChanges || control.pristine
              ? of(true)
              : control.valueChanges.pipe(
                  debounceTime(1000),
                  take(1),
                  switchMap((name: string) =>
                    this.context.data?.name === name
                      ? of(true)
                      : this.leaveConfigsService.checkLeaveTypeNameExists(name)
                  ),
                  tap(() => control.markAsTouched())
                ),
          message: () => this.translocoService.selectTranslate('VALIDATION.valueExisting'),
        },
      },
    },
    {
      key: 'description',
      className: 'tui-form__row block',
      type: 'text-area',
      templateOptions: {
        translate: true,
        label: 'description',
        labelClassName: 'font-semibold',
        placeholder: 'enterDescription',
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'paidLeave',
      className: 'tui-form__row block',
      type: 'checkbox-labeled',
      defaultValue: true,
      templateOptions: {
        labelClassName: 'font-semibold',
        translate: true,
        label: `${TRANSLATION_SCOPE}.paidLeave`,
      },
    },
    {
      key: 'paidLeaveTransfer',
      className: 'tui-form__row block',
      type: 'checkbox-labeled',
      defaultValue: true,
      templateOptions: {
        labelClassName: 'font-semibold',
        translate: true,
        label: `${TRANSLATION_SCOPE}.canTransferTo`,
      },
    },
    {
      key: 'statusBoolean',
      className: 'tui-form__row block',
      type: 'status-toggle',
      defaultValue: true,
      templateOptions: {
        translate: true,
        label: 'status',
        textfieldLabelOutside: true,
        labelClassName: 'font-semibold',
      },
    },
    {
      key: 'processId',
      className: 'tui-form__row block',
      type: 'select',
      templateOptions: {
        translate: true,
        label: 'workflow',
        labelClassName: 'font-semibold',
        placeholder: 'chooseWorkflow',
        options: this.workflowsQuery.selectAll(),
        labelProp: 'name',
        valueProp: 'id',
        required: true,
      },
    },
    { key: 'id' },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, LeaveType>,
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly leaveConfigsService: AdminLeaveConfigsService,
    private readonly translocoService: TranslocoService,
    private readonly workflowsQuery: WorkflowsQuery,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly actions: Actions
  ) {
    this.actions.dispatch(loadWorkflows());
  }

  ngOnInit(): void {
    if (this.context.data) {
      this.model = {
        ...this.model,
        ...this.context.data,
        statusBoolean: this.context.data.status === CommonStatus.active,
      };
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel: LeaveType = { ...this.form.value };

      formModel.status = formModel.statusBoolean ? CommonStatus.active : CommonStatus.inactive;
      this.leaveConfigsService
        .upsert(this.leaveConfigAPIUrlPath, formModel)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          this.promptService.handleResponse(
            formModel.id ? 'leaveConfigs.editLeaveTypeSuccessfully' : 'leaveConfigs.createLeaveTypeSuccessfully',
            () => this.context.completeWith(true)
          )
        );
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
