import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { PromptService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { takeUntil, tap } from 'rxjs/operators';
import { InitWorkflow } from '../../models';
import { WorkflowService } from '../../services/workflow.service';

@Component({
  selector: 'hcm-create-process-dialog',
  templateUrl: './create-workflow-dialog.component.html',
  styleUrls: ['./create-workflow-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class CreateWorkflowDialogComponent {
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
        textfieldLabelOutside: true,
      },
    },
    {
      className: 'tui-form__row block',
      key: 'stateName',
      type: 'input',
      templateOptions: {
        translate: true,
        required: true,
        label: 'initStatus',
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
        textfieldLabelOutside: true,
      },
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
        labelProp: 'name',
        matcherBy: 'id',
      },
    },
  ];

  constructor(
    private fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, InitWorkflow>,
    private workflowService: WorkflowService,
    private destroy$: TuiDestroyService,
    private promptService: PromptService
  ) {}

  onCancel(): void {
    this.context.$implicit.complete();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.workflowService
        .initWorkflow(this.form.value)
        .pipe(
          tap(() => this.promptService.handleResponse()),
          takeUntil(this.destroy$)
        )
        .subscribe(() => this.context.completeWith(true));
    }
  }
}
