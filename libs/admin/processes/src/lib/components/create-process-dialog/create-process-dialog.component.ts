import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { ProcessInit } from '../../models/process';
import { StatusType } from '../../models/status-type';
import { ProcessesService } from '../../services/processes.service';

@Component({
  selector: 'hcm-create-process-dialog',
  templateUrl: './create-process-dialog.component.html',
  styleUrls: ['./create-process-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProcessDialogComponent {
  readonly statusTypes$ = this.processesService.select('statusTypes');
  form: FormGroup<ProcessInit> = this.fb.group({} as ProcessInit);
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
      validation: {
        messages: {
          required: () => this.translocoService.selectTranslate('VALIDATION.required'),
        },
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
      validation: {
        messages: {
          required: () => this.translocoService.selectTranslate('VALIDATION.required'),
        },
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
      type: 'object-select',
      templateOptions: {
        translate: true,
        required: true,
        options: this.statusTypes$,
        label: 'ADMIN_PROCESSES.stateType',
        labelProp: 'name',
        compareWith: (item1: StatusType, item2: StatusType) => item1.id === item2.id,
      },
      validation: {
        messages: {
          required: () => this.translocoService.selectTranslate('VALIDATION.required'),
        },
      },
    },
  ];
  model = {} as ProcessInit;

  constructor(
    private fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<unknown, ProcessInit>,
    private processesService: ProcessesService,
    private translocoService: TranslocoService
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
