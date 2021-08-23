import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ConditionType } from '../../enums';
import { TransitionCondition, TransitionOption } from '../../models';
import { AdminWorkflowService } from '../../services/admin-workflow.service';

@Component({
  selector: 'hcm-add-condition-to-transition-dialog',
  templateUrl: './add-condition-to-transition-dialog.component.html',
  styleUrls: ['./add-condition-to-transition-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddConditionToTransitionDialogComponent implements OnInit {
  form = this.fb.group<TransitionOption<ConditionType>>({} as TransitionOption<ConditionType>);
  model = {} as TransitionOption<ConditionType>;
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

  constructor(private readonly fb: FormBuilder, private adminWorkflowService: AdminWorkflowService) {}

  ngOnInit(): void {
    //
  }
}
