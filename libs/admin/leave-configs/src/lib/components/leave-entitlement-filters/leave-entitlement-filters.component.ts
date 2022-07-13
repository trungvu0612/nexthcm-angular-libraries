import { HttpParams } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Inject,
  Injector,
  Input,
  LOCALE_ID,
  Output,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseObject, BaseUser, JobTitlesService, OfficesService, PromptService } from '@nexthcm/cdk';
import { TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { ProviderScope } from '@ngneat/transloco/lib/types';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDayRange, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { endOfDay, getTime } from 'date-fns';
import omit from 'just-omit';
import { FileSaverService } from 'ngx-filesaver';
import { from, of, Subject } from 'rxjs';
import { catchError, map, share, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

import { AdminLeaveConfigsService } from '../../admin-leave-configs.service';
import { LeaveEntitlementFiltersType, LeaveEntitlementsExportType } from '../../enums';
import { LeaveEntitlementFilters } from '../../models';
import { SelectLeaveEntitlementsExportTypeDialogComponent } from '../select-leave-entitlements-export-type-dialog/select-leave-entitlements-export-type-dialog.component';

interface LeaveEntitlementFiltersForm extends LeaveEntitlementFilters {
  fromTo?: TuiDayRange;
  leaveType?: BaseObject;
  employee?: BaseUser;
  organization?: BaseObject;
  jobTitle?: BaseObject;
  type?: LeaveEntitlementFiltersType;
}

@Component({
  selector: 'hcm-leave-entitlement-filters',
  templateUrl: './leave-entitlement-filters.component.html',
  styleUrls: ['./leave-entitlement-filters.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class LeaveEntitlementFiltersComponent {
  @Output() view = new EventEmitter<LeaveEntitlementFilters>();
  @Input() isExport?: boolean;

  model = {} as LeaveEntitlementFiltersForm;
  form = this.fb.group(this.model);
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
            label: `${this.translocoScope.scope}.generateFor`,
            labelClassName: 'font-semibold',
            labelProp: 'label',
            valueProp: 'value',
            options: this.translocoService
              .selectTranslateObject('LEAVE_ENTITLEMENT_FILTERS_TYPE', {}, this.translocoScope.scope)
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
            serverRequest: (searchQuery: string) => this.jobTitlesService.searchJobTitles(searchQuery),
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
            options: this.officesService.offices$,
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
  readonly export$ = new Subject<{ params: HttpParams; fileName: string; exportType: LeaveEntitlementsExportType }>();
  readonly exportHandler$ = this.export$.pipe(
    switchMap(({ params, fileName, exportType }) =>
      this.leaveConfigsService.exportLeaveEntitlements(params, exportType).pipe(
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
    @Inject(TRANSLOCO_SCOPE) private readonly translocoScope: ProviderScope,
    private readonly fb: FormBuilder,
    private readonly translocoService: TranslocoService,
    private readonly leaveConfigsService: AdminLeaveConfigsService,
    private readonly jobTitlesService: JobTitlesService,
    private readonly officesService: OfficesService,
    private readonly promptService: PromptService,
    private readonly fileSaverService: FileSaverService,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly destroy$: TuiDestroyService,
    @Inject(LOCALE_ID) private readonly locale: string
  ) {
    jobTitlesService.doLoadJobTitles();
    officesService.doLoadOffices();
  }

  onFilters(): void {
    this.view.emit(this.handleFormModel({ ...this.form.value }));
  }

  onExport(): void {
    if (this.form.valid) {
      this.dialogService
        .open<LeaveEntitlementsExportType>(
          new PolymorpheusComponent(SelectLeaveEntitlementsExportTypeDialogComponent, this.injector),
          { label: this.translocoService.translate('exportLeaveEntitlements', {}, this.translocoScope.scope) }
        )
        .pipe(takeUntil(this.destroy$))
        .subscribe((exportType) => {
          const formModel = { ...this.form.value };
          const model = this.handleFormModel(formModel);
          const exportTypeString =
            formModel.type === LeaveEntitlementFiltersType.LeaveType
              ? formModel.leaveType?.name
              : formModel.employee?.name;
          const dateRangeString = formModel.fromTo ? `_${formModel.fromTo.getFormattedDayRange('DMY', '-')}` : '';
          const fileName = `${exportType === LeaveEntitlementsExportType.CnB ? 'CnB_' : ''}LEAVE_USAGE${
            exportTypeString ? `_${exportTypeString}` : ''
          }${dateRangeString}.xlsx`;
          let params = new HttpParams();

          const primitiveKeys: (keyof LeaveEntitlementFilters)[] = [
            'employeeId',
            'orgId',
            'leaveTypeId',
            'jobTitleId',
            'fromDate',
            'toDate',
          ];
          for (const key of primitiveKeys) {
            const value = model[key];

            params = value ? params.set(key, value) : params.delete(key);
          }
          this.export$.next({ params, fileName, exportType });
        });
    }
  }

  handleFormModel(formModel: LeaveEntitlementFiltersForm): LeaveEntitlementFilters {
    const { employee, organization, leaveType, jobTitle, fromTo, ...model } = omit(formModel, 'type');

    model.employeeId = employee?.id;
    model.orgId = organization?.id;
    model.leaveTypeId = leaveType?.id;
    model.jobTitleId = jobTitle?.id;
    model.fromDate = fromTo ? getTime(fromTo.from.toLocalNativeDate()) : undefined;
    model.toDate = fromTo ? getTime(endOfDay(fromTo.to.toLocalNativeDate())) : undefined;

    return model;
  }
}
