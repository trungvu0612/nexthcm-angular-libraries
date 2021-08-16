import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { InitWorkflow } from '../../models/workflow';
import { WorkflowService } from '../../services/workflow.service';

@Component({
  selector: 'hcm-create-process-dialog',
  templateUrl: './create-workflow-dialog.component.html',
  styleUrls: ['./create-workflow-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateWorkflowDialogComponent {
  readonly statusTypes$ = this.workflowService.select('statusTypes');
  form: FormGroup<InitWorkflow> = this.fb.group({} as InitWorkflow);
  fields: FormlyFieldConfig[] = [
    {
      className: 'tui-form__row block',
      key: 'processName',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'ADMIN_PROCESSES.name',
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
        label: 'ADMIN_PROCESSES.initStatus',
        textfieldLabelOutside: true,
      },
    },
    {
      className: 'tui-form__row block',
      key: 'stateDescription',
      type: 'input',
      templateOptions: {
        translate: true,
        label: 'ADMIN_PROCESSES.initStatusDescription',
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
        options: this.statusTypes$,
        label: 'ADMIN_PROCESSES.stateType',
        labelProp: 'name',
        matcherBy: 'id',
      },
    },
  ];
  model = {} as InitWorkflow;

  constructor(
    private fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<unknown, InitWorkflow>,
    private workflowService: WorkflowService
  ) {}

  onCancel(): void {
    this.context.$implicit.complete();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.context.completeWith(this.model);
    }
  }
}
