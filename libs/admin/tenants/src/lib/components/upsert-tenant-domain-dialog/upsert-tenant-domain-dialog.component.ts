import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { PromptService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { distinctUntilChanged, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
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
    { key: 'id' },
    {
      key: 'name',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'Domain name',
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'status',
      className: 'tui-form__row block',
      type: 'toggle',
      templateOptions: {
        textfieldLabelOutside: true,
        labelClassName: 'font-semibold',
      },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('status'),
        'templateOptions.description': this.form?.valueChanges.pipe(
          startWith(null),
          map((value) => value?.status),
          distinctUntilChanged(),
          switchMap((status) => this.translocoService.selectTranslate(`${status ? 'active' : 'inactive'}`))
        ),
      },
    },
    {
      key: 'domainUrl',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'domainUrl',
        textfieldLabelOutside: true,
      },
    },
  ];

  constructor(
    private readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, TenantDomain>,
    private readonly translocoService: TranslocoService,
    private readonly adminTenantsService: AdminTenantsService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService
  ) {}

  ngOnInit(): void {
    if (this.context.data) {
      this.model = { ...this.model, ...this.context.data };
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.adminTenantsService
        .upsertTenantDomain(this.form.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.promptService.handleResponse('', () => this.context.completeWith(true)));
    }
  }
}
