import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Process } from '../../models/process';
import { ProcessesService } from '../../services/processes.service';

@Component({
  selector: 'hcm-create-process-dialog',
  templateUrl: './create-process-dialog.component.html',
  styleUrls: ['./create-process-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProcessDialogComponent {
  readonly statusTypes$ = this.processesService.select('statusTypes');
  form: FormGroup<Process> = this.fb.group({});
  fields: FormlyFieldConfig[] = [
    {
      className: 'tui-form__row block',
      key: 'processName',
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
      key: 'processDescription',
      type: 'input',
      templateOptions: {
        translate: true,
        label: 'Description',
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
        label: 'Initial Status',
        textfieldLabelOutside: true,
      },
    },
    {
      className: 'tui-form__row block',
      key: 'stateDescription',
      type: 'input',
      templateOptions: {
        translate: true,
        label: 'Initial Status Description',
        textfieldLabelOutside: true,
      },
    },
    {
      className: 'tui-form__row block',
      key: 'stateTypeId',
      type: 'select',
      templateOptions: {
        translate: true,
        required: true,
        options: this.statusTypes$,
        label: 'State Type',
        valueProp: 'id',
        labelProp: 'name',
      },
    },
  ];
  model: Process = {};

  constructor(
    private fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<unknown, Process>,
    private processesService: ProcessesService
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
