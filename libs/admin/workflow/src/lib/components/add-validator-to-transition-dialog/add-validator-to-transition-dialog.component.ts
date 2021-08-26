import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { AbstractAddOptionToTransitionComponent } from '../../abstract-components/abstract-add-option-to-transition.component';
import { ValidatorType } from '../../enums';
import { TransitionOption, TransitionValidator } from '../../models';
import { AdminWorkflowService } from '../../services/admin-workflow.service';

@Component({
  selector: 'hcm-add-validator-to-transition-dialog',
  templateUrl: './add-validator-to-transition-dialog.component.html',
  styleUrls: ['./add-validator-to-transition-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddValidatorToTransitionDialogComponent extends AbstractAddOptionToTransitionComponent<ValidatorType> {
  fields: FormlyFieldConfig[] = [
    {
      key: 'validatorType',
      className: 'tui-form__row block',
      type: 'select-transition-option',
      templateOptions: {
        options: this.adminWorkflowService.select('validatorTypes'),
        required: true,
      },
    },
    {
      key: 'users',
      className: 'tui-form__row block',
      type: 'multi-select',
      templateOptions: {
        translate: true,
        label: 'users',
        labelClassName: 'font-semibold',
        required: true,
        options: [],
      },
      hideExpression: (model: TransitionValidator) => model.validatorType?.code !== ValidatorType.UserPermission,
    },
    {
      key: 'permissions',
      className: 'tui-form__row block',
      type: 'multi-select-search',
      templateOptions: {
        translate: true,
        label: 'permissions',
        labelClassName: 'font-semibold',
        textfieldLabelOutside: true,
        placeholder: 'searchPermissions',
        required: true,
        serverRequest: (searchQuery: string) => this.adminWorkflowService.getPermissions(searchQuery),
      },
      hideExpression: (model: TransitionValidator) =>
        ![ValidatorType.Permission, ValidatorType.UserPermission].includes(model.validatorType?.code),
    },
  ];

  constructor(
    readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT)
    readonly context: TuiDialogContext<TransitionOption<ValidatorType>, TransitionOption<ValidatorType>>,
    readonly adminWorkflowService: AdminWorkflowService
  ) {
    super(fb, context, adminWorkflowService);
  }
}
