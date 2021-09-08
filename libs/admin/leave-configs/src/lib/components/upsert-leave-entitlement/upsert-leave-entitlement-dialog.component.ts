import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { BaseUser } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT, PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { LeaveConfigsService } from '../../leave-configs.service';
import { LeaveEntitlement } from '../../models/leave-entitlement';

@Component({
  selector: 'hcm-upsert-leave-entitlement-dialog',
  templateUrl: './upsert-leave-entitlement-dialog.component.html',
  styleUrls: ['./upsert-leave-entitlement-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertLeaveEntitlementDialogComponent implements OnInit {
  @ViewChild('userContent', { static: true }) userContent!: PolymorpheusTemplate<BaseUser>;
  readonly userContext!: { $implicit: BaseUser };

  form = this.fb.group<LeaveEntitlement>({} as LeaveEntitlement);
  model = {} as LeaveEntitlement;
  fields: FormlyFieldConfig[] = [
    { key: 'id' },
    { key: 'fromDate', defaultValue: 1609434000000 },
    { key: 'toDate', defaultValue: 1640969999000 },
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
    // {
    //   key: 'employeeId',
    //   className: 'tui-form__row block',
    //   type: 'user-combo-box',
    //   templateOptions: {
    //     translate: true,
    //     label: 'sendTo',
    //     labelClassName: 'font-semibold',
    //     placeholder: 'chooseAPerson',
    //     customContent: this.userContent,
    //     serverRequest: (searchQuery: string) => this.adminEntitlementService.searchUsers(searchQuery),
    //     labelProp: 'username',
    //     valueProp: 'id',
    //     matcherBy: 'id',
    //     textfieldLabelOutside: true,
    //   },
    //   hideExpression: '(model.status)',
    //   expressionProperties: {
    //     className: '(model.status)  ?  "hidden" : ""',
    //   },
    // },
    {
      key: 'employeeId',
      className: 'tui-form__row block',
      type: 'user-combo-box',
      templateOptions: {
        translate: true,
        label: 'sendTo',
        labelClassName: 'font-semibold',
        placeholder: 'chooseAPerson',
        labelProp: 'username',
        valueProp: 'id',
        textfieldLabelOutside: true,
      },
      hideExpression: 'model.status',
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
        options: this.leaveConfigsService.select('org'),
        labelProp: 'name',
        matcherBy: 'id',
        valueProp: 'id',
      },
      hideExpression: '!model.status',
      expressionProperties: {
        className: '!(model.status)  ?  "hidden" : ""',
      },
    },
    {
      key: 'jobTitleDTOList',
      className: 'tui-form__row block',
      type: 'multi-select',
      templateOptions: {
        translate: true,
        label: 'Job Title',
        labelClassName: 'font-semibold',
        placeholder: 'chooseRoles',
        options: this.leaveConfigsService.select('jobTitles'),
        matcherBy: 'id',
      },
      hideExpression: '!model.status',
      expressionProperties: {
        className: '!model.status ? "hidden" : ""',
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
        options: this.leaveConfigsService.select('leaveTypes'),
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
        options: this.leaveConfigsService.select('leavePeriod'),
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
    private fb: FormBuilder,
    private authService: AuthService,
    private translocoService: TranslocoService,
    private leaveConfigsService: LeaveConfigsService
  ) {}

  ngOnInit(): void {
    if (this.context.data) {
      if (this.form.value.status === 1) {
        this.model.status = true;
      } else {
        this.model.status = false;
      }
      this.model = { ...this.model, ...this.context.data };
      console.log('aaaaaaaaaaaa', this.context.data);
      this.model.jobTitleDTOList = this.context.data.jobTitleDTOList;
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      if (this.model.status === true) {
        this.form.value.status = this.form.value.status = 1 as number;
      } else {
        this.form.value.status = this.form.value.status = 0 as number;
      }
      const arrayTitle = [];
      if (this.model.jobTitleDTOList) {
        for (const item of this.model.jobTitleDTOList) {
          arrayTitle.push(item.id);
        }
        this.form.value.jobTitle = arrayTitle;
      }
      this.form.value.entitlement = +this.model.entitlement;
      const formModel = { ...this.form.value };
      this.context.completeWith(formModel);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
