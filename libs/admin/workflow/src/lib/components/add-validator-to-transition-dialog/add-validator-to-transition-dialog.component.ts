import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BaseUser } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT, PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';
import { map } from 'rxjs/operators';
import { AbstractAddOptionToTransitionComponent } from '../../abstract-components/abstract-add-option-to-transition.component';
import { ValidatorType } from '../../enums';
import { TransitionOption, TransitionOptionsDialogData, TransitionValidator } from '../../models';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';

@Component({
  selector: 'hcm-add-validator-to-transition-dialog',
  templateUrl: './add-validator-to-transition-dialog.component.html',
  styleUrls: ['./add-validator-to-transition-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddValidatorToTransitionDialogComponent
  extends AbstractAddOptionToTransitionComponent<ValidatorType, TransitionValidator>
  implements OnInit
{
  @ViewChild('userContent', { static: true }) userContent!: PolymorpheusTemplate<BaseUser>;

  fields!: FormlyFieldConfig[];
  readonly userContext!: { $implicit: BaseUser };

  constructor(
    readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT)
    readonly context: TuiDialogContext<
      TransitionOption<ValidatorType>,
      TransitionOptionsDialogData<ValidatorType, TransitionValidator>
    >,
    readonly adminWorkflowsService: AdminWorkflowsService
  ) {
    super(fb, context, adminWorkflowsService);
  }

  ngOnInit(): void {
    this.fields = [
      {
        key: 'validatorType',
        className: 'tui-form__row block',
        type: 'select-transition-option',
        templateOptions: {
          options: this.adminWorkflowsService
            .select('validatorTypes')
            .pipe(
              map((types) =>
                types.filter((type) => this.context.data.items.every((item) => item.validatorType.id !== type.id))
              )
            ),
          required: true,
        },
      },
      {
        key: 'users',
        className: 'tui-form__row block',
        type: 'multi-select-search',
        templateOptions: {
          translate: true,
          label: 'users',
          labelClassName: 'font-semibold',
          textfieldLabelOutside: true,
          placeholder: 'searchUsers',
          required: true,
          serverRequest: (searchQuery: string) => this.adminWorkflowsService.getUsers(searchQuery),
          customContent: this.userContent,
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
          serverRequest: (searchQuery: string) => this.adminWorkflowsService.getPermissions(searchQuery),
        },
        hideExpression: (model: TransitionValidator) =>
          ![ValidatorType.Permission, ValidatorType.UserPermission].includes(model.validatorType?.code),
      },
    ];
  }
}