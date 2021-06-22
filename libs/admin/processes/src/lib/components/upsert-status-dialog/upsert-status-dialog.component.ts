import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
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
    { key: 'id' },
    {
      className: 'tui-form__row block',
      key: 'name',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'ADMIN_PROCESSES.name',
        textfieldLabelOutside: true,
      },
      validation: {
        messages: {
          required: () => this.translocoService.selectTranslate('VALIDATION.required'),
        },
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
      type: 'object-select',
      templateOptions: {
        translate: true,
        required: true,
        options: this.statusTypes$,
        label: 'ADMIN_PROCESSES.stateType',
        labelProp: 'name',
      },
      validation: {
        messages: {
          required: () => this.translocoService.selectTranslate('VALIDATION.required'),
        },
      },
    },
  ];
  model: State = {
    id: uuidv4(),
    name: '',
  };

  constructor(
    private fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<State, State>,
    private processesService: ProcessesService,
    private translocoService: TranslocoService
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
