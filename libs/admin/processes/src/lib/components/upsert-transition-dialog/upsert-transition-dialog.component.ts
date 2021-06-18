import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { v4 as uuidv4 } from 'uuid';
import { Transition } from '../../models/process';

@Component({
  selector: 'hcm-upsert-transition-dialog',
  templateUrl: './upsert-transition-dialog.component.html',
  styleUrls: ['./upsert-transition-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertTransitionDialogComponent implements OnInit {
  form: FormGroup<Transition> = this.fb.group({} as Transition);
  options: FormlyFormOptions = {
    formState: {
      isNew: true,
    },
  };
  model: Transition = {
    id: uuidv4(),
    name: '',
    toStateId: '',
  };
  fields: FormlyFieldConfig[] = [
    { key: 'id' },
    {
      className: 'tui-form__row block',
      key: 'fromStateId',
      type: 'select',
      templateOptions: {
        translate: true,
        label: 'From status',
        options: this.data.states,
        labelProp: 'name',
        valueProp: 'id',
      },
      hideExpression: '!formState.isNew',
    },
    {
      className: 'tui-form__row block',
      key: 'toStateId',
      type: 'select',
      templateOptions: {
        translate: true,
        required: true,
        label: 'To status',
        options: this.data.states,
        labelProp: 'name',
        valueProp: 'id',
      },
      hideExpression: '!formState.isNew',
      validators: {
        validation: [RxwebValidators.different({ fieldName: 'fromStateId' })],
      },
    },
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
  ];

  constructor(
    private fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<any, Transition>
  ) {}

  get data(): any {
    return this.context.data;
  }

  ngOnInit(): void {
    if (this.data) {
      this.model = { ...this.model, ...this.data.transition };
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
