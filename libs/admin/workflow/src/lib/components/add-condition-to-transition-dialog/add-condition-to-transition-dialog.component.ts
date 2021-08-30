import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { map } from 'rxjs/operators';
import { AbstractAddOptionToTransitionComponent } from '../../abstract-components/abstract-add-option-to-transition.component';
import { ConditionType } from '../../enums';
import { TransitionCondition, TransitionOption, TransitionOptionsDialogData } from '../../models';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';

@Component({
  selector: 'hcm-add-condition-to-transition-dialog',
  templateUrl: './add-condition-to-transition-dialog.component.html',
  styleUrls: ['./add-condition-to-transition-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddConditionToTransitionDialogComponent extends AbstractAddOptionToTransitionComponent<
  ConditionType,
  TransitionCondition
> {
  fields: FormlyFieldConfig[] = [
    {
      key: 'conditionType',
      className: 'tui-form__row block',
      type: 'select-transition-option',
      templateOptions: {
        options: this.adminWorkflowsService
          .select('conditionTypes')
          .pipe(
            map((types) =>
              types.filter((type) => this.context.data.items.every((item) => item.conditionType.id !== type.id))
            )
          ),
        required: true,
      },
    },
    {
      key: 'values',
      className: 'tui-form__row block',
      type: 'multi-select-search',
      templateOptions: {
        translate: true,
        label: 'permissions',
        labelClassName: 'font-semibold',
        placeholder: 'searchPermissions',
        textfieldLabelOutside: true,
        required: true,
        serverRequest: (searchQuery: string) => this.adminWorkflowsService.getPermissions(searchQuery),
      },
      hideExpression: (model: TransitionCondition) => model.conditionType?.code !== ConditionType.Permission,
    },
    {
      key: 'values',
      className: 'tui-form__row block',
      type: 'multi-select-search',
      templateOptions: {
        translate: true,
        label: 'jobTitles',
        labelClassName: 'font-semibold',
        textfieldLabelOutside: true,
        placeholder: 'searchJobTitles',
        required: true,
        serverRequest: (searchQuery: string) => this.adminWorkflowsService.searchJobTitles(searchQuery),
      },
      hideExpression: (model: TransitionCondition) => model.conditionType?.code !== ConditionType.UserInTitles,
    },
  ];

  constructor(
    readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT)
    readonly context: TuiDialogContext<
      TransitionOption<ConditionType>,
      TransitionOptionsDialogData<ConditionType, TransitionCondition>
    >,
    readonly adminWorkflowsService: AdminWorkflowsService
  ) {
    super(fb, context, adminWorkflowsService);
  }
}
