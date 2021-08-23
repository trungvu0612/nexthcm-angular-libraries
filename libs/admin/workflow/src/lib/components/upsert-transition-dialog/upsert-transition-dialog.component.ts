import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { v4 as uuidv4 } from 'uuid';
import {
  Transition,
  TransitionCondition,
  TransitionPostFunction,
  TransitionValidator,
  UpsertTransitionData,
} from '../../models';

@Component({
  selector: 'hcm-upsert-transition-dialog',
  templateUrl: './upsert-transition-dialog.component.html',
  styleUrls: ['./upsert-transition-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertTransitionDialogComponent implements OnInit {
  form = this.fb.group<Transition>({} as Transition);
  options: FormlyFormOptions = {
    formState: {
      isNew: true,
    },
  };
  model = {
    conditions: new Array<TransitionCondition>(),
    validators: new Array<TransitionValidator>(),
    postFunctions: new Array<TransitionPostFunction>(),
  } as Transition;
  fields: FormlyFieldConfig[] = [
    { key: 'id', defaultValue: uuidv4() },
    {
      className: 'tui-form__row block',
      key: 'fromStateId',
      type: 'select',
      templateOptions: {
        translate: true,
        label: 'fromStatus',
        labelClassName: 'font-semibold',
        options: this.data.addedStatuses,
        labelProp: 'name',
        valueProp: 'id',
        matcherBy: 'id',
      },
      hideExpression: '!formState.isNew',
      validators: {
        validation: [RxwebValidators.different({ fieldName: 'toStateId' })],
      },
      validation: {
        messages: {
          different: () => this.translocoService.selectTranslate('VALIDATION.differentSource'),
        },
      },
    },
    {
      className: 'tui-form__row block',
      key: 'toStateId',
      type: 'select',
      templateOptions: {
        translate: true,
        required: true,
        label: 'toStatus',
        labelClassName: 'font-semibold',
        options: this.data.addedStatuses,
        labelProp: 'name',
        valueProp: 'id',
        matcherBy: 'id',
      },
      hideExpression: '!formState.isNew',
      validators: {
        validation: [RxwebValidators.different({ fieldName: 'fromStateId' })],
      },
      validation: {
        messages: {
          different: () => this.translocoService.selectTranslate('VALIDATION.differentTarget'),
        },
      },
    },
    {
      className: 'tui-form__row block',
      key: 'name',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'name',
        labelClassName: 'font-semibold',
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
        labelClassName: 'font-semibold',
        textfieldLabelOutside: true,
      },
    },
  ];

  constructor(
    private fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<Transition, UpsertTransitionData>,
    private translocoService: TranslocoService
  ) {}

  get data(): UpsertTransitionData {
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
