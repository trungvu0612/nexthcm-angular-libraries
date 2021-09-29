import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { BaseUser } from '@nexthcm/cdk';
import { FormBuilder, FormControl } from '@ngneat/reactive-forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TUI_DEFAULT_STRINGIFY, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT, PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';
import { iif, of } from 'rxjs';
import { map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AbstractAddOptionToTransitionComponent } from '../../abstract-components/abstract-add-option-to-transition.component';
import { ValidatorType } from '../../enums';
import { TransitionOption, TransitionOptionsDialogData, TransitionValidator } from '../../models';
import { AdminWorkflowsService } from '../../services/admin-workflows.service';
import { ValidatorTypesQuery } from '../../state';

@Component({
  selector: 'hcm-add-validator-to-transition-dialog',
  templateUrl: './add-validator-to-transition-dialog.component.html',
  styleUrls: ['./add-validator-to-transition-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class AddValidatorToTransitionDialogComponent
  extends AbstractAddOptionToTransitionComponent<TransitionValidator>
  implements OnInit
{
  @ViewChild('userContent', { static: true }) userContent!: PolymorpheusTemplate<BaseUser>;

  fields!: FormlyFieldConfig[];
  readonly userContext!: { $implicit: BaseUser };
  options: FormlyFormOptions = {
    formState: {
      validatorTypeCode: undefined,
    },
  };

  constructor(
    readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT)
    readonly context: TuiDialogContext<TransitionValidator, TransitionOptionsDialogData<TransitionValidator>>,
    readonly adminWorkflowsService: AdminWorkflowsService,
    private readonly validatorTypesQuery: ValidatorTypesQuery,
    private readonly destroy$: TuiDestroyService
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
          options: this.validatorTypesQuery
            .selectAll()
            .pipe(
              map((types) =>
                types.filter((type) => this.context.data.items.every((item) => item.validatorType.id !== type.id))
              )
            ),
          required: true,
        },
        hooks: {
          onInit: (field) => {
            const formControl = field?.formControl as FormControl<TransitionOption<ValidatorType>>;

            formControl?.valueChanges
              .pipe(startWith(formControl?.value), takeUntil(this.destroy$))
              .subscribe((validatorType) => (this.options.formState.validatorTypeCode = validatorType?.code));
          },
        },
      },
      {
        key: 'values',
        className: 'tui-form__row block',
        fieldGroup: [
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
            hideExpression: (model, formState) => formState.validatorTypeCode !== ValidatorType.UserPermission,
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
              stringify: TUI_DEFAULT_STRINGIFY,
              objectValue: false,
              serverRequest: (searchQuery: string) =>
                of(searchQuery).pipe(
                  switchMap((searchQuery) =>
                    iif(() => searchQuery.length > 2, this.adminWorkflowsService.getPermissions(searchQuery), of([]))
                  )
                ),
            },
            hideExpression: (model, formState) =>
              ![ValidatorType.Permission, ValidatorType.UserPermission].includes(formState.validatorTypeCode),
          },
        ],
      },
    ];
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };

      if (!formModel.values.users) {
        formModel.values.users = [];
      }
      this.context.completeWith(formModel);
    }
  }
}
