import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Workflow } from '../../models/workflow';
import { ProcessesService } from '../../services/processes.service';
import { GLOBAL_STATUS_TYPES_RX_STATE, GlobalStatusTypesState } from '../../state/status-types';

@Component({
  selector: 'hcm-create-process-dialog',
  templateUrl: './create-process-dialog.component.html',
  styleUrls: ['./create-process-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProcessDialogComponent {
  readonly statusTypes$ = this.globalStatusTypesState.select('statusTypes');
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
      type: 'input',
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
      type: 'input',
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
        options: this.statusTypes$,
        label: 'State Type',
        valueProp: 'id',
        labelProp: 'name',
      },
    },
  ];
  model: Workflow = {};

  constructor(
    private fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<unknown, Workflow>,
    private processesService: ProcessesService,
    @Inject(GLOBAL_STATUS_TYPES_RX_STATE) private globalStatusTypesState: RxState<GlobalStatusTypesState>
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
