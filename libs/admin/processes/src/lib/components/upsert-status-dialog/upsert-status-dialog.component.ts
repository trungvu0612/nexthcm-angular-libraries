import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { v4 as uuidv4 } from 'uuid';
import { State } from '../../models/process';
import { ProcessesService } from '../../services/processes.service';

@Component({
  selector: 'hcm-upsert-status-dialog',
  templateUrl: './upsert-status-dialog.component.html',
  styleUrls: ['./upsert-status-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertStatusDialogComponent implements OnInit {
  readonly statusTypes$ = this.processesService.select('statusTypes');
  form: FormGroup<State> = this.fb.group({} as State);
  fields: FormlyFieldConfig[] = [
    { key: 'stateValueId' },
    {
      className: 'tui-form__row block',
      key: 'name',
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
      key: 'description',
      type: 'text-area',
      templateOptions: {
        translate: true,
        label: 'Description',
        textfieldLabelOutside: true,
      },
    },
    {
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
  model: State = {
    stateValueId: uuidv4(),
    name: '',
  };

  constructor(
    private fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<State, State>,
    private processesService: ProcessesService,
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
