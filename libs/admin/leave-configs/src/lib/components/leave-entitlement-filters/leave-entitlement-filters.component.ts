import { formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, EventEmitter, Inject, LOCALE_ID, Output } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import {
  BaseObject,
  BaseUser,
  JobTitlesQuery,
  loadJobTitles,
  loadOffices,
  OfficesQuery,
  PromptService,
} from '@nexthcm/cdk';
import { Control, FormBuilder } from '@ng-stack/forms';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDayRange } from '@taiga-ui/cdk';
import { endOfDay, getTime } from 'date-fns';
import { FileSaverService } from 'ngx-filesaver';
import { from, of, Subject } from 'rxjs';
import { catchError, map, share, startWith, switchMap, tap } from 'rxjs/operators';
import { AdminLeaveConfigsService } from '../../admin-leave-configs.service';
import { LeaveEntitlementFiltersType } from '../../enums';
import { LeaveEntitlementFilters } from '../../models';

interface LeaveEntitlementFiltersForm extends LeaveEntitlementFilters {
  fromTo?: Control<TuiDayRange>;
  leaveType?: Control<BaseObject>;
  employee?: Control<BaseUser>;
  organization?: Control<BaseObject>;
  jobTitle?: Control<BaseObject>;
  type?: LeaveEntitlementFiltersType;
}

@Component({
  selector: 'hcm-leave-entitlement-filters',
  templateUrl: './leave-entitlement-filters.component.html',
  styleUrls: ['./leave-entitlement-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveEntitlementFiltersComponent {
  @Output() view = new EventEmitter<LeaveEntitlementFilters>();

  model = {} as LeaveEntitlementFiltersForm;
  form = this.fb.group<LeaveEntitlementFiltersForm>(this.model);
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'grid grid-cols-4 gap-4',
      fieldGroup: [
        {
          key: 'type',
          type: 'select',
          defaultValue: LeaveEntitlementFiltersType.LeaveType,
          templateOptions: {
            translate: true,
            label: 'generateFor',
            labelClassName: 'font-semibold',
            translocoScope: this.scope,
            labelProp: 'label',
            valueProp: 'value',
            options: this.translocoService
              .selectTranslateObject('LEAVE_ENTITLEMENT_FILTERS_TYPE', {}, (this.scope as ProviderScope).scope)
              .pipe(
                map((result) => [
                  { label: result.leaveType, value: LeaveEntitlementFiltersType.LeaveType },
                  { label: result.employee, value: LeaveEntitlementFiltersType.Employee },
                ])
              ),
          },
        },
        {
          key: 'leaveType',
          type: 'combo-box',
          templateOptions: {
            translate: true,
            label: 'leaveType',
            labelClassName: 'font-semibold',
            placeholder: 'searchLeaveTypes',
            textfieldLabelOutside: true,
            textfieldCleaner: true,
            serverRequest: (searchQuery: string) => this.leaveConfigsService.searchLeaveTypes(searchQuery),
            matcherBy: 'id',
          },
          hideExpression: (model) => model.type !== LeaveEntitlementFiltersType.LeaveType,
          expressionProperties: {
            className: (model) => (model.type !== LeaveEntitlementFiltersType.LeaveType ? 'hidden' : ''),
          },
        },
        {
          key: 'employee',
          type: 'user-combo-box',
          templateOptions: {
            translate: true,
            label: 'employee',
            labelClassName: 'font-semibold',
            placeholder: 'searchUsers',
            textfieldCleaner: true,
          },
          hideExpression: (model) => model.type !== LeaveEntitlementFiltersType.Employee,
          expressionProperties: {
            className: (model) => (model.type !== LeaveEntitlementFiltersType.Employee ? 'hidden' : ''),
          },
        },
        {
          key: 'fromTo',
          type: 'input-date-range',
          className: 'col-span-2',
          templateOptions: {
            translate: true,
            label: 'dateRange',
            labelClassName: 'font-semibold',
            placeholder: 'chooseDateRange',
            textfieldLabelOutside: true,
            textfieldCleaner: true,
          },
        },
        {
          key: 'jobTitle',
          type: 'combo-box',
          templateOptions: {
            translate: true,
            label: 'jobTitle',
            labelClassName: 'font-semibold',
            textfieldLabelOutside: true,
            textfieldCleaner: true,
            placeholder: 'searchJobTitles',
            serverRequest: (searchQuery: string) => this.jobTitlesQuery.searchJobTitles(searchQuery),
            matcherBy: 'id',
          },
          hideExpression: (model) => model.type !== LeaveEntitlementFiltersType.LeaveType,
          expressionProperties: {
            className: (model) => (model.type !== LeaveEntitlementFiltersType.LeaveType ? 'hidden' : ''),
          },
        },
        {
          key: 'officeId',
          type: 'select',
          templateOptions: {
            translate: true,
            label: 'office',
            labelClassName: 'font-semibold',
            options: this.officesQuery.selectAll(),
            placeholder: 'chooseOffice',
            labelProp: 'name',
            valueProp: 'id',
            textfieldCleaner: true,
          },
          hideExpression: (model) => model.type !== LeaveEntitlementFiltersType.LeaveType,
          expressionProperties: {
            className: (model) => (model.type !== LeaveEntitlementFiltersType.LeaveType ? 'hidden' : ''),
          },
        },
        {
          key: 'organization',
          type: 'select-org-tree',
          templateOptions: {
            translate: true,
            label: 'department',
            labelClassName: 'font-semibold',
            placeholder: 'chooseDepartment',
            textfieldCleaner: true,
          },
          hideExpression: (model) => model.type !== LeaveEntitlementFiltersType.LeaveType,
          expressionProperties: {
            className: (model) => (model.type !== LeaveEntitlementFiltersType.LeaveType ? 'hidden' : ''),
          },
        },
      ],
    },
  ];
  readonly export$ = new Subject<{ params: HttpParams; fileName: string }>();
  readonly exportHandler$ = this.export$.pipe(
    switchMap(({ params, fileName }) =>
      this.leaveConfigsService.exportLeaveEntitlements(params).pipe(
        tap((blob) => {
          this.fileSaverService.save(blob, fileName);
        }),
        catchError((err) =>
          from(this.promptService.open({ icon: 'error', html: this.promptService.generateErrorMessage(err) }))
        ),
        startWith(null)
      )
    ),
    share()
  );
  readonly exportLoading$ = this.exportHandler$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly translocoService: TranslocoService,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
    private readonly leaveConfigsService: AdminLeaveConfigsService,
    private readonly jobTitlesQuery: JobTitlesQuery,
    private readonly officesQuery: OfficesQuery,
    private readonly promptService: PromptService,
    private readonly fileSaverService: FileSaverService,
    @Inject(LOCALE_ID) private readonly locale: string,
    actions: Actions
  ) {
    actions.dispatch(loadJobTitles());
    actions.dispatch(loadOffices());
  }

  onFilters(): void {
    this.view.emit(this.handleFormModel({ ...this.form.value }));
  }

  onExport(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };
      const model = this.handleFormModel(formModel);
      const exportTypeString =
        formModel.type === LeaveEntitlementFiltersType.LeaveType ? formModel.leaveType?.name : formModel.employee?.name;
      const dateRangeString = formModel.fromTo
        ? `_${formatDate(model.fromDate, 'mediumDate', this.locale)}_${formatDate(
            model.toDate,
            'mediumDate',
            this.locale
          )}`
        : '';
      const fileName = `LEAVE_USAGE${exportTypeString ? `_${exportTypeString}` : ''}${dateRangeString}.xlsx`;
      let params = new HttpParams();

      for (const key of Object.keys(model) as Array<keyof LeaveEntitlementFilters>) {
        params = model[key] ? params.set(key, model[key]) : params.delete(key);
      }
      this.export$.next({ params, fileName });
    }
  }

  handleFormModel(formModel: LeaveEntitlementFiltersForm): LeaveEntitlementFilters {
    const { employee, organization, leaveType, jobTitle, fromTo, type, ...model } = formModel;

    if (employee) {
      model.employeeId = employee.id;
    }
    if (organization) {
      model.orgId = organization.id;
    }
    if (leaveType) {
      model.leaveTypeId = leaveType.id;
    }
    if (jobTitle) {
      model.jobTitleId = jobTitle.id;
    }
    if (fromTo) {
      model.fromDate = getTime(fromTo.from.toLocalNativeDate());
      model.toDate = getTime(endOfDay(fromTo.to.toLocalNativeDate()));
    }

    return model;
  }
}
