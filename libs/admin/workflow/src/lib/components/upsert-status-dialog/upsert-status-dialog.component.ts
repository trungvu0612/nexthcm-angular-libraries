import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { v4 as uuidv4 } from 'uuid';
import { State } from '../../models';
import { WorkflowService } from '../../services/workflow.service';

@Component({
  selector: 'hcm-upsert-status-dialog',
  templateUrl: './upsert-status-dialog.component.html',
  styleUrls: ['./upsert-status-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertStatusDialogComponent implements OnInit {
  form = this.fb.group<State>({} as State);
  model = {} as State;
  fields: FormlyFieldConfig[] = [
    { key: 'id', defaultValue: uuidv4() },
    {
      className: 'tui-form__row block',
      key: 'name',
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
      key: 'description',
      type: 'text-area',
      templateOptions: {
        translate: true,
        label: 'description',
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
      },
    },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<State, State>,
    private fb: FormBuilder,
    private workflowService: WorkflowService
  ) {}

  get data(): State {
    return this.context.data;
  }

  ngOnInit(): void {
    if (this.data) {
      this.model = { ...this.model, ...this.data };
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.context.completeWith(this.model);
    }
  }
}
