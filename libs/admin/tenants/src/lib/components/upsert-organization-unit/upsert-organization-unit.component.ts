import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormGroup } from '@ngneat/reactive-forms';
import { OrganizationalUnit } from '../../models/tenant';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { AdminTenantsService } from '../../services/admin-tenants.service';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { PromptService } from '@nexthcm/cdk';
import { switchMap, takeUntil } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'hcm-upsert-organization-unit',
  templateUrl: './upsert-organization-unit.component.html',
  styleUrls: ['./upsert-organization-unit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UpsertOrganizationUnitComponent {
  readonly form = new FormGroup<Partial<OrganizationalUnit>>({});
  model: Partial<OrganizationalUnit> = this.context.data.unit;
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
        label: 'organizationalLevel',
        labelClassName: 'font-semibold',
        placeholder: 'chooseOrganizationalLevel',
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
        label: 'parentLevel',
        labelClassName: 'font-semibold',
        placeholder: 'chooseParentLevel',
        labelProp: 'orgName',
        subLabelProp: 'orgType',
        matcherBy: 'id',
      },
      expressionProperties: { 'templateOptions.disabled': '!model.orgType' },
      hideExpression: 'model.id',
      hooks: {
        /*onInit: (field?: FormlyFieldConfig) => {
          if (field?.templateOptions) {
            field.templateOptions.options = this.form.controls.orgType?.valueChanges.pipe(
              switchMap((orgType) => (orgType ? this.adminTenantsService.getParentLevel(orgType) : of([])))
            );
          }
        },*/
      },
    },
    {
      key: 'user',
      type: 'select',
      className: 'tui-form__row block',
      templateOptions: {
        translate: true,
        label: 'manager',
        labelClassName: 'font-semibold',
        placeholder: 'chooseManager',
        labelProp: 'username',
        subLabelProp: 'code',
        textfieldCleaner: true,
        options: [],
        matcherBy: 'id',
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
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<boolean, { unit: Partial<OrganizationalUnit>; levels: string[] }>,
    private readonly adminTenantsService: AdminTenantsService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService
  ) {}

  onCancel() {
    this.context.$implicit.complete();
  }

  submitUnit() {
    if (this.form.valid)
      this.adminTenantsService
        .upsertOrganizationUnit(this.model)
        .pipe(
          switchMap(() => this.promptService.open({ icon: 'success' } as SweetAlertOptions)),
          takeUntil(this.destroy$)
        )
        .subscribe(() => this.context.completeWith(true));
  }
}
