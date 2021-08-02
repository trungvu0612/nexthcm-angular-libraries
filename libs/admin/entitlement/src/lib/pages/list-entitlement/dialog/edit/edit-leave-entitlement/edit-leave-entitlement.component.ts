import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { FormGroup } from '@ngneat/reactive-forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { LeaveEntitlement } from '../../../../../models/leave-entitlement';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { NumericValueType, RxwebValidators } from '@rxweb/reactive-form-validators';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { AdminEntitlementService } from '../../../../../services/admin-entitlement.service';
import { TranslocoService } from '@ngneat/transloco';
import { AuthService } from '@nexthcm/auth';

@Component({
  selector: 'hcm-edit-leave-entitlement',
  templateUrl: './edit-leave-entitlement.component.html',
  styleUrls: ['./edit-leave-entitlement.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditLeaveEntitlementComponent implements OnInit {

  form = new FormGroup({});

  params$ = new BehaviorSubject<{ page?: number; size?: number }>({ size: 100 });
  jobTitles$: Observable<any[]> = this.adminEntitlementService
    .getJobTitles(this.params$.value)
    .pipe(map((data) => data.items));

  leaveTypes$: Observable<any[]> = this.adminEntitlementService
    .getLeaveTypes(this.params$.value)
    .pipe(map((data) => data.items));

  orgs$: Observable<any[]> = this.adminEntitlementService
    .getOrgs(this.params$.value)
    .pipe(map((data) => data.items));

  emp$: Observable<any[]> = this.adminEntitlementService
    .getEmployees(this.params$.value)
    .pipe(map((data) => data.items));

  period$: Observable<any[]> = this.adminEntitlementService
    .getPeriods(this.params$.value)
    .pipe(map((data) => data.items));

  data = this.context.data || '';

  readonly adminUserRoleForm = new FormGroup({});
  model: Partial<LeaveEntitlement> = {};
  options: FormlyFormOptions = {};
  fields: FormlyFieldConfig[] = [
    /*Add to multiple employees*/
    {
      key: 'statusCov',
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
        )
      }
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
        options: this.emp$,
        labelProp: 'name',
        matcherBy: 'id'
      },
      hideExpression: '(model.statusCov)',
      expressionProperties: {
        className:
          '(model.statusCov)  ?  "hidden" : ""',
      },
    },
    {
      key: 'org',
      type: 'select',
      templateOptions: {
        translate: true,
        label: 'Organization',
        labelClassName: 'font-semibold',
        placeholder: 'Organization',
        required: true,
        options: this.orgs$,
        labelProp: 'name',
        matcherBy: 'id'
      },
      hideExpression: '!(model.statusCov)',
      expressionProperties: {
        className:
          '!(model.statusCov)  ?  "hidden" : ""',
      },
    },
    {
      key: 'jobTitle',
      className: 'tui-form__row block',
      type: 'multi-select',
      templateOptions: {
        translate: true,
        required: true,
        label: 'Job Title',
        labelClassName: 'font-semibold',
        placeholder: 'chooseRoles',
        options: this.jobTitles$,
        labelProp: 'name',
        matcherBy: 'id'
      },
      hideExpression: '!(model.statusCov)',
      expressionProperties: {
        className:
          '!(model.statusCov)  ?  "hidden" : ""',
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
        options: this.leaveTypes$,
        labelProp: 'name',
        matcherBy: 'id'
      }
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
        options: this.period$,
        labelProp: 'name',
        matcherBy: 'id'
      }
    },
    {
      key: 'entitlement',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'Entitlement',
        placeholder: 'Total leave can approve',
        textfieldLabelOutside: true
      },
      validators: { validation: [RxwebValidators.numeric({ acceptValue: NumericValueType.PositiveNumber })] }
    }

  ];

  readonly loggedInUserId = this.authService.get('userInfo', 'userId');

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<unknown, LeaveEntitlement>,
    private adminEntitlementService: AdminEntitlementService,
    private translocoService: TranslocoService,
    private authService: AuthService,
  ) {
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
  }

  submit() {

    if (this.model){
      if (this.model.statusCov){
        if (this.model.entitlement){
          this.model.entitlement = +this.model.entitlement
          const arrayTitle = []
          if (this.model.jobTitle){
            for (const value of this.model.jobTitle) {
              arrayTitle.push(value.id)
            }
          }
          const body = {
            status: 1,
            fromDate: 1609434000000, /*API have but not used => hard code*/
            toDate: 1640969999000, /*API have but not used => hard code*/
            orgId: this.model.org?.id ? this.model.org?.id : '',
            entitlement: this.model.entitlement,
            leaveType: this.model.leaveType,
            period: this.model.period,
            jobTitle: arrayTitle,
          }
          this.context.completeWith(body);
        }
      } else if (!this.model.statusCov){
        if (this.model.entitlement){
          this.model.entitlement = +this.model.entitlement
          const arrayTitle = []
          if (this.model.jobTitle){
            for (const value of this.model.jobTitle) {
              arrayTitle.push(value.id)
            }
          }
          const body = {
            status: 0,
            fromDate: 1609434000000, /*API have but not used => hard code*/
            toDate: 1640969999000, /*API have but not used => hard code*/
            entitlement: this.model.entitlement,
            leaveType: this.model.leaveType,
            period: this.model.period,
            employeeId: this.loggedInUserId,
            jobTitle: arrayTitle,
          }
          this.context.completeWith(body);
        }
      }
    }
  }

  cancel() {
    this.context.completeWith(false);
  }


}
