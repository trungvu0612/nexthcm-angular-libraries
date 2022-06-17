import { AfterViewInit, ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { AuthService } from '@nexthcm/auth';
import { PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { isPresent, TuiDestroyService, TuiTime } from '@taiga-ui/cdk';
import { of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

import { WorkingTimesService } from '../../services/working-times.service';

enum Overtime {
  none,
  payroll,
  paidLeave,
}

const TIME_KEYS = [
  'checkInAfter',
  'checkOutBefore',
  'workingHour',
  'startLunch',
  'endLunch',
  'totalWorkingHour',
  'startTimeInWorkingDay',
  'endTimeInWorkingDay',
  'maximumPeriodTimeCheckOutInApp',
];

@Component({
  selector: 'hcm-working-time-configuration',
  templateUrl: './working-time-configuration.component.html',
  styleUrls: ['./working-time-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class WorkingTimeConfigurationComponent implements AfterViewInit {
  readonly orgControl = new UntypedFormControl();
  readonly form = new UntypedFormGroup({});
  model = {
    items: Array.from({ length: 7 }, (_, index) => ({ weekDayId: index + 1, configType: 0, values: [{}] })),
  };
  fields!: FormlyFieldConfig[];

  readonly orgTree$ = this.workingTimesService.getOrganizationChart(this.authService.get('userInfo', 'tenantId') || '');
  readonly request$ = this.orgControl.valueChanges.pipe(
    switchMap(({ id }) => this.workingTimesService.getWorkingHourConfigByOrg(id).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((v) => !v),
    catchError(() => of(false))
  );
  submitting = false;

  constructor(
    @Inject(TRANSLOCO_SCOPE) private translocoScope: ProviderScope,
    private promptService: PromptService,
    private authService: AuthService,
    private workingTimesService: WorkingTimesService,
    private translocoService: TranslocoService,
    private destroy$: TuiDestroyService
  ) {}

  trackByOrgId(_: number, { id }: { id: string }): string {
    return id;
  }

  ngAfterViewInit(): void {
    this.fields = [
      { key: 'id' },
      { key: 'orgId' },
      {
        expressionProperties: {
          template: this.translocoService
            .selectTranslate(this.translocoScope.scope + '.weeklyWorkingTime')
            .pipe(map((title) => `<h2 class="border-b text-lg font-semibold my-6">${title}</h2>`)),
        },
      },
      {
        key: 'items',
        type: 'daily-hour-config',
        fieldArray: {
          fieldGroup: [
            { key: 'weekDayId' },
            { key: 'configType' },
            {
              key: 'values',
              type: 'repeat',
              templateOptions: {
                hideAddButton: true,
                hideRemoveButton: true,
              },
              fieldArray: {
                fieldGroupClassName: 'flex gap-4',
                fieldGroup: [
                  {
                    className: 'block w-32',
                    key: 'from',
                    type: 'input-time',
                    templateOptions: {
                      translate: true,
                      label: 'from',
                      textfieldLabelOutside: false,
                      textfieldCleaner: true,
                    },
                  },
                  {
                    className: 'block w-32',
                    key: 'to',
                    type: 'input-time',
                    templateOptions: {
                      translate: true,
                      label: 'to',
                      textfieldLabelOutside: false,
                      textfieldCleaner: true,
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        expressionProperties: {
          template: this.translocoService
            .selectTranslate(this.translocoScope.scope + '.workingTimeDetail')
            .pipe(map((title) => `<h2 class="border-b text-lg font-semibold my-6">${title}</h2>`)),
        },
      },
      {
        fieldGroupClassName: 'grid grid-cols-4 gap-4 items-center',
        fieldGroup: [
          {
            key: 'checkInAfter',
            type: 'input-time',
            templateOptions: {
              translate: true,
              textfieldLabelOutside: true,
              required: true,
              label: `${this.translocoScope.scope}.morningCheckInBefore`,
              labelClassName: 'font-semibold',
            },
          },
          {
            key: 'checkOutBefore',
            type: 'input-time',
            templateOptions: {
              translate: true,
              textfieldLabelOutside: true,
              required: true,
              label: `${this.translocoScope.scope}.afternoonCheckOutAfter`,
              labelClassName: 'font-semibold',
            },
          },
          {
            key: 'startLunch',
            type: 'input-time',
            templateOptions: {
              translate: true,
              label: `${this.translocoScope.scope}.startLunch`,
              labelClassName: 'font-semibold',
              textfieldLabelOutside: true,
              required: true,
            },
          },
          {
            key: 'endLunch',
            type: 'input-time',
            templateOptions: {
              translate: true,
              label: `${this.translocoScope.scope}.endLunch`,
              labelClassName: 'font-semibold',
              textfieldLabelOutside: true,
              required: true,
            },
          },
          {
            key: 'workingHour',
            type: 'input-time',
            templateOptions: {
              translate: true,
              label: `${this.translocoScope.scope}.minimumWorkingHours`,
              labelClassName: 'font-semibold',
              textfieldLabelOutside: true,
              required: true,
            },
          },
          {
            key: 'totalWorkingHour',
            type: 'input-time',
            templateOptions: {
              translate: true,
              label: `${this.translocoScope.scope}.maximumWorkingHours`,
              labelClassName: 'font-semibold',
              textfieldLabelOutside: true,
              required: true,
            },
          },
          {
            key: 'startTimeInWorkingDay',
            type: 'input-time',
            templateOptions: {
              translate: true,
              label: `${this.translocoScope.scope}.startTime`,
              labelClassName: 'font-semibold',
              textfieldLabelOutside: true,
              required: true,
            },
          },
          {
            key: 'endTimeInWorkingDay',
            type: 'input-time',
            templateOptions: {
              translate: true,
              label: `${this.translocoScope.scope}.endTime`,
              labelClassName: 'font-semibold',
              textfieldLabelOutside: true,
              required: true,
            },
          },
          {
            key: 'maxPaidLeaveToCash',
            type: 'input-count',
            templateOptions: {
              textfieldLabelOutside: true,
              translate: true,
              label: `${this.translocoScope.scope}.maxPaidLeaveToCash`,
              labelClassName: 'font-semibold',
            },
          },
          {
            key: 'fingerPrint',
            type: 'checkbox-labeled',
            defaultValue: true,
            templateOptions: {
              labelClassName: 'font-semibold',
              translate: true,
              label: `${this.translocoScope.scope}.useTimekeeper`,
            },
          },
          {
            key: 'convertOT',
            className: 'col-span-2',
            type: 'select',
            defaultValue: Overtime.none,
            templateOptions: {
              translate: true,
              label: `${this.translocoScope.scope}.convertOT`,
              labelClassName: 'font-semibold',
              valueProp: 'value',
              options: this.translocoService
                .selectTranslateObject('CONVERT_OT_OPTIONS', {}, this.translocoScope.scope)
                .pipe(
                  map((result) => [
                    { label: result.none, value: Overtime.none },
                    { label: result.payroll, value: Overtime.payroll },
                    { label: result.paidLeave, value: Overtime.paidLeave },
                  ])
                ),
            },
          },
          {
            key: 'maximumPeriodTimeCheckOutInApp',
            type: 'input-time',
            templateOptions: {
              translate: true,
              label: `${this.translocoScope.scope}.maximumPeriodTimeCheckOutInApp`,
              labelClassName: 'font-semibold',
              textfieldLabelOutside: true,
              required: true,
            },
          },
        ],
      },
    ];

    this.workingTimesService
      .getOrgs()
      .pipe(
        map(({ data: { items } }) => items.find(({ id }) => id === this.authService.get('userInfo', 'orgId'))),
        takeUntil(this.destroy$)
      )
      .subscribe((org) => this.orgControl.setValue(org));

    this.request$
      .pipe(
        filter(isPresent),
        tap(({ data }) => {
          const { timePayroll, timePaidLeave, ...model } = data;

          TIME_KEYS.forEach(
            (key) => ((model as any)[key] = TuiTime.fromAbsoluteMilliseconds((model as any)[key] * 1000))
          );

          model.items
            .sort((a, b) => {
              if (a.weekDayId === 1) return 1;
              else if (b.weekDayId === 1) return -1;
              else return a.weekDayId - b.weekDayId;
            })
            .forEach((item: any) => {
              if (item.values.length) {
                item.values[0].from = TuiTime.fromAbsoluteMilliseconds(item.values[0].from * 1000);
                item.values[0].to = TuiTime.fromAbsoluteMilliseconds(item.values[0].to * 1000);
              } else item.values = [{}];
            });

          (model as any).convertOT = timePayroll
            ? Overtime.payroll
            : timePaidLeave
            ? Overtime.paidLeave
            : Overtime.none;

          this.model = model;
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  saveSettings(): void {
    if (this.form.valid) {
      this.submitting = true;
      const { convertOT, ...body } = this.form.value;

      TIME_KEYS.forEach((key) => (body[key] = body[key].toAbsoluteMilliseconds() / 1000));
      body.items = body.items.map((item: any) => {
        const newItem = { ...item };
        const { from, to } = newItem.values[0];

        if (from && to) {
          newItem.values = [{ from: from.toAbsoluteMilliseconds() / 1000, to: to.toAbsoluteMilliseconds() / 1000 }];
        } else newItem.values = [];

        return newItem;
      });
      body.timePayroll = convertOT === Overtime.payroll;
      body.timePaidLeave = convertOT === Overtime.paidLeave;

      this.workingTimesService
        .saveSettings(body)
        .pipe(
          tap(this.promptService.handleResponse('updateSuccessfully')),
          catchError(() => of(null)),
          takeUntil(this.destroy$)
        )
        .subscribe(() => (this.submitting = false));
    }
  }
}
