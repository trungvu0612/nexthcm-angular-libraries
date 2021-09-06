import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { startWith } from 'rxjs/internal/operators/startWith';
import { distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { LeaveEntitlement } from '../../models/leave-entitlement';
import { AdminEntitlementService } from '../../services/admin-entitlement.service';

@Component({
  selector: 'hcm-upsert-entitlement',
  templateUrl: './upsert-entitlement.component.html',
  styleUrls: ['./upsert-entitlement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertEntitlementComponent implements OnInit {
  form = this.fb.group<LeaveEntitlement>({} as LeaveEntitlement);
  model = {} as LeaveEntitlement;
  fields: FormlyFieldConfig[] = [
    // { key: 'fromDate', defaultValue: 1609434000000 },
    // { key: 'toDate', defaultValue: 1640969999000 },
    // { key: 'orgId', defaultValue: '' },
    {
      key: 'status',
      type: 'toggle',
      defaultValue: true,
      templateOptions: { textfieldLabelOutside: true, labelClassName: 'font-semibold' },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('Add to multiple employees'),
        'templateOptions.description': this.form?.valueChanges.pipe(
          startWith(null),
          map((value) => value?.status),
          distinctUntilChanged(),
          switchMap((status) => this.translocoService.selectTranslate(`${status ? 'active' : 'inactive'}`))
        ),
      },
    },
    {
      key: 'employeeId',
      type: 'select',
      templateOptions: {
        translate: true,
        label: 'Employee',
        labelClassName: 'font-semibold',
        placeholder: 'Employee',
        required: true,
        options: this.adminEntitlementService.select('emp'),
        labelProp: 'username',
        matcherBy: 'id',
      },
      hideExpression: '(model.status)',
      expressionProperties: {
        className: '(model.status)  ?  "hidden" : ""',
      },
    },
    {
      key: 'orgId',
      type: 'select',
      templateOptions: {
        translate: true,
        label: 'Organization',
        labelClassName: 'font-semibold',
        placeholder: 'Organization',
        options: this.adminEntitlementService.select('org'),
        labelProp: 'name',
        matcherBy: 'id',
      },
      hideExpression: '!(model.status)',
      expressionProperties: {
        className: '!(model.status)  ?  "hidden" : ""',
      },
    },
    {
      key: 'jobTitle',
      className: 'tui-form__row block',
      type: 'multi-select',
      templateOptions: {
        translate: true,
        label: 'Job Title',
        labelClassName: 'font-semibold',
        placeholder: 'chooseRoles',
        options: this.adminEntitlementService.select('jobTitles'),
        matcherBy: 'id',
      },
      hideExpression: '!(model.status)',
      expressionProperties: {
        className: '!(model.status)  ?  "hidden" : ""',
      },
    },
    {
      key: 'leaveType',
      type: 'select',
      templateOptions: {
        translate: true,
        label: 'Leave Type',
        labelClassName: 'font-semibold',
        placeholder: 'Leave Type',
        required: true,
        options: this.adminEntitlementService.select('leaveTypes'),
        labelProp: 'name',
        matcherBy: 'id',
      },
    },
    {
      key: 'period',
      type: 'select',
      templateOptions: {
        translate: true,
        label: 'Period',
        labelClassName: 'font-semibold',
        placeholder: 'Period',
        required: true,
        options: this.adminEntitlementService.select('leavePeriod'),
        labelProp: 'name',
        matcherBy: 'id',
      },
    },
    {
      key: 'entitlement',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'Entitlements',
        placeholder: 'Total leave can approve',
        textfieldLabelOutside: true,
      },
      validators: { validation: [RxwebValidators.numeric({ acceptValue: NumericValueType.PositiveNumber })] },
    },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<LeaveEntitlement, LeaveEntitlement>,
    private adminEntitlementService: AdminEntitlementService,
    private fb: FormBuilder,
    private authService: AuthService,
    private translocoService: TranslocoService
  ) {}

  ngOnInit(): void {
    if (this.context.data) {
      if (this.form.value.status === 1) {
        this.model.status = true;
      } else {
        this.model.status = false;
      }
      this.model = { ...this.model, ...this.context.data };
      this.model.jobTitle = this.context.data.jobTitleDTOList;
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.model.status === true) {
        this.form.value.status = this.form.value.status = 1 as number;
      } else {
        this.form.value.status = this.form.value.status = 0 as number;
      }
      this.form.value.entitlement = +this.model.entitlement;
      this.form.value.orgId = this.model.org?.orgId as string
      const formModel = { ...this.form.value };
      this.context.completeWith(formModel);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
