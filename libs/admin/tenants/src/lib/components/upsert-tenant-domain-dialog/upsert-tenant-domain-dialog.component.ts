import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { CommonStatus, PromptService } from '@nexthcm/cdk';
import { AbstractControl, FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { of } from 'rxjs';
import { debounceTime, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { TenantDomain } from '../../models/tenant';
import { AdminTenantsService } from '../../services/admin-tenants.service';

@Component({
  selector: 'hcm-upsert-tenant-domain-dialog',
  templateUrl: './upsert-tenant-domain-dialog.component.html',
  styleUrls: ['./upsert-tenant-domain-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UpsertTenantDomainDialogComponent implements OnInit {
  form = this.fb.group<TenantDomain>({} as TenantDomain);
  model = {} as TenantDomain;
  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      className: 'tui-form__row block',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'name',
        labelClassName: 'font-semibold',
        placeholder: 'enterName',
        textfieldLabelOutside: true,
      },
      asyncValidators: {
        uniqueName: {
          expression: (control: AbstractControl<string>) =>
            !control.valueChanges || control.pristine
              ? of(true)
              : control.valueChanges.pipe(
                  debounceTime(1000),
                  take(1),
                  switchMap((name: string) =>
                    this.context.data.name === name
                      ? of(true)
                      : this.adminTenantsService.checkDomainNameExisting({ name, tenant: { id: this.model.id } })
                  ),
                  tap(() => control.markAsTouched())
                ),
          message: () => this.translocoService.selectTranslate('VALIDATION.valueExisting'),
        },
      },
    },
    {
      key: 'domainUrl',
      type: 'input',
      className: 'tui-form__row block',
      templateOptions: {
        required: true,
        translate: true,
        label: 'domain',
        placeholder: 'enterDomain',
        labelClassName: 'font-semibold',
        textfieldLabelOutside: true,
      },
      asyncValidators: {
        uniqueUrl: {
          expression: (control: AbstractControl<string>) =>
            !control.valueChanges || control.pristine
              ? of(true)
              : control.valueChanges.pipe(
                  debounceTime(1000),
                  take(1),
                  switchMap((domainUrl: string) =>
                    this.context.data.domainUrl === domainUrl
                      ? of(true)
                      : this.adminTenantsService.checkDomainUrlExisting({ domainUrl, tenant: { id: this.model.id } })
                  ),
                  tap(() => control.markAsTouched())
                ),
          message: () => this.translocoService.selectTranslate('VALIDATION.valueExisting'),
        },
      },
    },
    {
      key: 'statusBoolean',
      className: 'tui-form__row block',
      type: 'status-toggle',
      defaultValue: true,
      templateOptions: {
        translate: true,
        label: 'status',
        textfieldLabelOutside: true,
        labelClassName: 'font-semibold',
      },
    },
    { key: 'id' },
    { key: 'tenant.id', defaultValue: this.routerQuery.getParams('tenantId') },
  ];

  constructor(
    private readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, TenantDomain>,
    private readonly translocoService: TranslocoService,
    private readonly adminTenantsService: AdminTenantsService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly routerQuery: RouterQuery
  ) {}

  ngOnInit(): void {
    if (this.context.data) {
      this.model = {
        ...this.model,
        ...this.context.data,
        statusBoolean: this.context.data.status !== CommonStatus.active,
      };
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };

      formModel.status = formModel.statusBoolean ? CommonStatus.active : CommonStatus.inactive;
      this.adminTenantsService
        .upsertTenantDomain(formModel)
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.promptService.handleResponse('', () => this.context.completeWith(true)));
    }
  }
}
