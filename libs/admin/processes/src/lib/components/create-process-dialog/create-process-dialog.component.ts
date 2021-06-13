import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { Workflow } from '../../models/workflow';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';

@Component({
  selector: 'hcm-create-process-dialog',
  templateUrl: './create-process-dialog.component.html',
  styleUrls: ['./create-process-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProcessDialogComponent implements OnInit {
  form: FormGroup<Workflow> = this.fb.group({});
  fields: FormlyFieldConfig[] = [
    {
      className: 'tui-form__row block',
      key: 'process.name',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'Name',
        textfieldLabelOutside: true,
      },
    },
    {
      className: 'tui-form__row block',
      key: 'process.description',
      type: 'text-area',
      templateOptions: {
        translate: true,
        label: 'Description',
        textfieldLabelOutside: true,
      },
    },
    {
      className: 'tui-form__row block',
      key: 'state[0].name',
      type: 'input',
      templateOptions: {
        translate: true,
        required: true,
        label: 'Initial Status',
        textfieldLabelOutside: true,
      },
    },
    {
      className: 'tui-form__row block',
      key: 'state[0].description',
      type: 'text-area',
      templateOptions: {
        translate: true,
        label: 'Initial Status Description',
        textfieldLabelOutside: true,
      },
    },
    {
      className: 'tui-form__row block',
      key: 'state[0].stateTypeId',
      type: 'select',
      templateOptions: {
        translate: true,
        required: true,
        options: [],
        label: 'State Type',
      },
    },
  ];
  model: Workflow = {};

  constructor(
    private fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<unknown, Workflow>
  ) {}

  ngOnInit(): void {}

  onCancel(): void {
    this.context.$implicit.complete();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.context.completeWith(this.model);
    }
  }
}
