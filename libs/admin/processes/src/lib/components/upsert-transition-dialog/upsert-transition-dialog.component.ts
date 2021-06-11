import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { Transition } from '../../models/workflow';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { v4 as uuidv4 } from 'uuid';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';

@Component({
  selector: 'hcm-upsert-transition-dialog',
  templateUrl: './upsert-transition-dialog.component.html',
  styleUrls: ['./upsert-transition-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertTransitionDialogComponent implements OnInit {
  form: FormGroup<Transition> = this.fb.group({} as Transition);
  fields: FormlyFieldConfig[] = [
    { key: 'transitionValueId' },
    {
      key: 'fromStateId',
      type: 'select',
      templateOptions: {
        translate: true,
        required: true,
        label: 'From status',
        options: this.data.states,
        labelProp: 'name',
        valueProp: 'stateValueId',
      },
    },
    {
      key: 'toStateId',
      type: 'select',
      templateOptions: {
        translate: true,
        required: true,
        label: 'To status',
        options: this.data.states,
        labelProp: 'name',
        valueProp: 'stateValueId',
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
      },
    },
    {
      className: 'tui-form__row block',
      key: 'description',
      type: 'text-area',
      templateOptions: {
        translate: true,
        label: 'Description',
      },
    },
    {
      key: 'stateTypeId',
    },
  ];
  model: Transition = {
    transitionValueId: uuidv4(),
    name: '',
    toStateId: '',
  };

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
