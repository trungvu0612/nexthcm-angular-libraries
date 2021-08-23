import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { AbstractAddOptionToTransitionComponent } from '../../abstract-components/abstract-add-option-to-transition.component';
import { ConditionType } from '../../enums';
import { TransitionCondition, TransitionOption } from '../../models';
import { AdminWorkflowService } from '../../services/admin-workflow.service';

@Component({
  selector: 'hcm-add-condition-to-transition-dialog',
  templateUrl: './add-condition-to-transition-dialog.component.html',
  styleUrls: ['./add-condition-to-transition-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddConditionToTransitionDialogComponent extends AbstractAddOptionToTransitionComponent<ConditionType> {
  fields: FormlyFieldConfig[] = [
    {
      key: 'conditionType',
      className: 'tui-form__row block',
      type: 'select-transition-option',
      templateOptions: {
        options: this.adminWorkflowService.select('conditionTypes'),
        required: true,
      },
    },
    {
      key: 'values',
      className: 'tui-form__row block',
      type: 'multi-select',
      templateOptions: {
        translate: true,
        label: 'permissions',
        labelClassName: 'font-semibold',
        required: true,
        options: [],
      },
      hideExpression: (model: TransitionCondition) => model.conditionType?.code !== ConditionType.Permission,
    },
  ];

  constructor(
    readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT)
    readonly context: TuiDialogContext<TransitionOption<ConditionType>, TransitionOption<ConditionType>>,
    readonly adminWorkflowService: AdminWorkflowService
  ) {
    super(fb, context, adminWorkflowService);
  }
}
