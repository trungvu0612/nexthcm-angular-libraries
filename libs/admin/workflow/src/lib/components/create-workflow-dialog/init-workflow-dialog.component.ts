import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { PromptService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { takeUntil, tap } from 'rxjs/operators';
import { InitWorkflow } from '../../models';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';

@Component({
  selector: 'hcm-init-workflow-dialog',
  templateUrl: './init-workflow-dialog.component.html',
  styleUrls: ['./init-workflow-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class InitWorkflowDialogComponent {
  form = this.fb.group<InitWorkflow>({} as InitWorkflow);
  model = {} as InitWorkflow;
  fields: FormlyFieldConfig[] = [
    {
      className: 'tui-form__row block',
      key: 'processName',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'name',
        labelClassName: 'font-semibold',
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
      },
    },
    {
      className: 'tui-form__row block',
      key: 'initStatus',
      type: 'status-combobox',
      templateOptions: {
        translate: true,
        required: true,
        label: 'initStatus',
        labelClassName: 'font-semibold',
        textfieldLabelOutside: true,
      },
    },
    {
      className: 'tui-form__row block',
      key: 'stateDescription',
      type: 'input',
      templateOptions: {
        translate: true,
        label: 'initStatusDescription',
        labelClassName: 'font-semibold',
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
        options: this.workflowService.select('statusTypes'),
        label: 'stateType',
        labelClassName: 'font-semibold',
        labelProp: 'name',
        matcherBy: 'id',
      },
      hideExpression: '!model.initStatus || model.initStatus?.id',
    },
  ];

  constructor(
    private fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<string, InitWorkflow>,
    private workflowService: AdminWorkflowsService,
    private destroy$: TuiDestroyService,
    private promptService: PromptService
  ) {}

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
