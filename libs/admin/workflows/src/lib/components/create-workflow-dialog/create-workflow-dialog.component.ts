import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseUser, PromptService, WorkflowStatusType } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT, PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';
import { takeUntil, tap } from 'rxjs/operators';

import { InitWorkflow } from '../../models';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';

@Component({
  selector: 'hcm-create-workflow-dialog',
  templateUrl: './create-workflow-dialog.component.html',
  styleUrls: ['./create-workflow-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class CreateWorkflowDialogComponent implements OnInit {
  @ViewChild('statusTypeContent', { static: true }) statusTypeContent!: PolymorpheusTemplate<BaseUser>;

  readonly statusTypeContext!: { $implicit: WorkflowStatusType };
  form = this.fb.group({} as InitWorkflow);
  model = {} as InitWorkflow;
  fields!: FormlyFieldConfig[];

  constructor(
    @Inject(TRANSLOCO_SCOPE) private readonly translocoScope: ProviderScope,
    private readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<string, InitWorkflow>,
    private readonly workflowService: AdminWorkflowsService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService
  ) {
    workflowService.doLoadStatusTypes();
    workflowService.doLoadStatuses();
  }

  ngOnInit(): void {
    this.fields = [
      {
        className: 'tui-form__row block',
        key: 'processName',
        type: 'input',
        templateOptions: {
          required: true,
          translate: true,
          label: 'name',
          labelClassName: 'font-semibold',
          placeholder: 'enterName',
          textfieldLabelOutside: true,
        },
      },
      {
        className: 'tui-form__row block',
        key: 'processDescription',
        type: 'input',
        templateOptions: {
          translate: true,
          label: 'description',
          labelClassName: 'font-semibold',
          textfieldLabelOutside: true,
          placeholder: 'enterDescription',
        },
      },
      {
        className: 'tui-form__row block',
        key: 'initStatus',
        type: 'status-combobox',
        templateOptions: {
          translate: true,
          required: true,
          label: `${this.translocoScope.scope}.initStatus`,
          labelClassName: 'font-semibold',
          textfieldLabelOutside: true,
          placeholder: `${this.translocoScope.scope}.searchStatusOrNameNewOne`,
        },
      },
      {
        className: 'tui-form__row block',
        key: 'stateDescription',
        type: 'input',
        templateOptions: {
          translate: true,
          label: `${this.translocoScope.scope}.initStatusDescription`,
          labelClassName: 'font-semibold',
          placeholder: `${this.translocoScope.scope}.enterStatusDescription`,
          textfieldLabelOutside: true,
        },
        hideExpression: '!model.initStatus || model.initStatus?.id',
      },
      {
        className: 'tui-form__row block',
        key: 'stateType',
        type: 'select',
        templateOptions: {
          translate: true,
          required: true,
          options: this.workflowService.statusTypes$,
          label: `${this.translocoScope.scope}.statusType`,
          labelClassName: 'font-semibold',
          labelProp: 'name',
          placeholder: `${this.translocoScope.scope}.chooseStatusType`,
          customContent: this.statusTypeContent,
        },
        hideExpression: '!model.initStatus || model.initStatus?.id',
      },
    ];
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.model };

      formModel.stateName = formModel.initStatus.name;
      if (formModel.initStatus.id) {
        formModel.stateDescription = formModel.initStatus.description;
        formModel.stateType = formModel.initStatus.stateType;
      }
      this.workflowService
        .initWorkflow(formModel)
        .pipe(
          tap(() => this.promptService.handleResponse()),
          takeUntil(this.destroy$)
        )
        .subscribe((res) => this.context.completeWith(res.data.id));
    }
  }
}
