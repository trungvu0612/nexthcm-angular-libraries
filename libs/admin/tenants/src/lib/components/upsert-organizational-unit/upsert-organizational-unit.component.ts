import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { PromptService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { of } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

import { OrganizationalUnit } from '../../models/tenant';
import { AdminTenantsService } from '../../services/admin-tenants.service';
import { TRANSLATION_SCOPE } from '../../translation-scope';

@Component({
  selector: 'hcm-upsert-organizational-unit',
  templateUrl: './upsert-organizational-unit.component.html',
  styleUrls: ['./upsert-organizational-unit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UpsertOrganizationalUnitComponent {
  readonly form = this.fb.group<OrganizationalUnit>({} as OrganizationalUnit);
  model = this.context.data.unit;
  readonly fields: FormlyFieldConfig[] = [
    {
      key: 'orgName',
      type: 'input',
      className: 'tui-form__row block',
      templateOptions: {
        required: true,
        translate: true,
        label: 'name',
        labelClassName: 'font-semibold',
        placeholder: 'enterName',
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'orgType',
      type: 'select',
      className: 'tui-form__row block',
      templateOptions: {
        required: true,
        translate: true,
        label: `${TRANSLATION_SCOPE}.organizationalLevel`,
        labelClassName: 'font-semibold',
        placeholder: `${TRANSLATION_SCOPE}.chooseOrganizationalLevel`,
        options: this.context.data?.levels,
      },
    },
    {
      key: 'ancestor',
      type: 'select',
      className: 'tui-form__row block',
      templateOptions: {
        required: true,
        translate: true,
        label: `${TRANSLATION_SCOPE}.parentLevel`,
        labelClassName: 'font-semibold',
        placeholder: 'chooseParentLevel',
        labelProp: `${TRANSLATION_SCOPE}.orgName`,
        subLabelProp: `${TRANSLATION_SCOPE}.orgType`,
        matcherBy: 'id',
      },
      expressionProperties: { 'templateOptions.disabled': '!model.orgType' },
      hideExpression: 'model.id',
      hooks: {
        onInit: (field?: FormlyFieldConfig) => {
          if (field?.templateOptions) {
            field.templateOptions.options = this.form.controls.orgType?.valueChanges.pipe(
              switchMap((orgType) =>
                orgType
                  ? this.adminTenantsService.getParentLevel(orgType, this.routerQuery.getParams('tenantId') as string)
                  : of([])
              )
            );
          }
        },
      },
    },
    {
      key: 'user',
      className: 'tui-form__row block',
      type: 'user-combo-box',
      templateOptions: {
        translate: true,
        required: true,
        label: 'manager',
        labelClassName: 'font-semibold',
        placeholder: 'chooseManager',
        tenantId: this.routerQuery.getParams('tenantId'),
      },
      hideExpression: 'model.id',
    },
    {
      key: 'description',
      type: 'text-area',
      className: 'tui-form__row block',
      templateOptions: {
        translate: true,
        label: 'description',
        labelClassName: 'font-semibold',
        textfieldLabelOutside: true,
      },
    },
    { key: 'id' },
  ];

  constructor(
    private readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<boolean, { unit: OrganizationalUnit; levels: string[] }>,
    private readonly adminTenantsService: AdminTenantsService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly routerQuery: RouterQuery
  ) {}

  onCancel(): void {
    this.context.$implicit.complete();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.adminTenantsService
        .upsertOrganizationalUnit(this.model)
        .pipe(tap(this.promptService.handleResponse()), takeUntil(this.destroy$))
        .subscribe(() => this.context.completeWith(true));
    }
  }
}
