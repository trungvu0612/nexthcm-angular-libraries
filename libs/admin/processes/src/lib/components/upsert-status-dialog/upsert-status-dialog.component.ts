import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { v4 as uuidv4 } from 'uuid';
import { State } from '../../models/workflow';

@Component({
  selector: 'hcm-upsert-status-dialog',
  templateUrl: './upsert-status-dialog.component.html',
  styleUrls: ['./upsert-status-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertStatusDialogComponent {
  form: FormGroup<State> = this.fb.group({} as State);
  fields: FormlyFieldConfig[] = [
    { key: 'stateValueId' },
    {
      key: 'name',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'PROCESS.name',
      },
    },
    {
      key: 'description',
      type: 'text-area',
      templateOptions: {
        translate: true,
        label: 'PROCESS.description',
      },
    },
    {
      key: 'stateTypeId',
    },
  ];
  model: State = {
    stateValueId: uuidv4(),
  };

  constructor(
    private fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<State, State>
  ) {}

  get data(): State {
    return this.context.data;
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
