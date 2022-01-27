import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { PromptService, secondsToTime } from '@nexthcm/cdk';
import { FormControl } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  isPresent,
  TuiContextWithImplicit,
  TuiDestroyService,
  tuiPure,
  TuiStringHandler,
  TuiTime,
} from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { of } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  mapTo,
  share,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { ConvertOvertime } from '../../enums';
import { Organization } from '../../models/organization';
import { WORKING_TIMES, WorkingTimes } from '../../models/working-times';
import { WorkingTimesService } from '../../services/working-times.service';
import { TRANSLATION_SCOPE } from '../../translation-scope';

@Component({
  selector: 'hcm-working-time-settings',
  templateUrl: './working-time-settings.component.html',
  styleUrls: ['./working-time-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class WorkingTimeSettingsComponent implements AfterViewInit {
  myOrgId = this.authService.get('userInfo').orgId;
  tenantId = this.authService.get('userInfo').tenantId;
  orgControl = new FormControl<Organization>();
  settingsElement: any;
  workingHourId: any;
  readonly dataWorkingTimes = WORKING_TIMES;
  form = new FormGroup({});
  model = {
    mondayTime: [{}],
    tuesdayTime: [{}],
    wednesdayTime: [{}],
    thursdayTime: [{}],
    fridayTime: [{}],
    saturdayTime: [{}],
    sundayTime: [{}],
  } as WorkingTimes;
  fields: FormlyFieldConfig[] = [];

  readonly orgTree$ = this.workingTimesService.getOrganizationChart(
    this.authService.get('userInfo', 'tenantId') as string
  );

  private readonly request$ = this.orgControl.value$.pipe(
    filter(isPresent),
    distinctUntilChanged(),
    switchMap(({ id }) => this.workingTimesService.getWorkingHourConfigByOrg(id).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    private cdr: ChangeDetectorRef,
    private workingTimesService: WorkingTimesService,
    private router: Router,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    private destroy$: TuiDestroyService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private promptService: PromptService,
    private translocoService: TranslocoService
  ) {}

  trackByOrgId(index: number, org: Organization): string {
    return org.id;
  }

  @tuiPure
  stringify(items: ReadonlyArray<Organization>): TuiStringHandler<TuiContextWithImplicit<string>> {
    const map = new Map(items.map(({ id, orgName }) => [id, orgName]));
    return ({ $implicit }: TuiContextWithImplicit<string>) => map.get($implicit) || '';
  }

  ngAfterViewInit(): void {
    this.fields = [
      {
        key: 'day2',
        type: 'checkbox-labeled',
        templateOptions: {
          labelClassName: 'font-semibold',
        },
        expressionProperties: {
          'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.monday'),
        },
        defaultValue: true,
      },
      {
        className: 'col-span-3',
        key: 'mondayTime',
        type: 'repeat',
        fieldArray: {
          fieldGroupClassName: 'flex space-x-4',
          fieldGroup: [
            {
              className: 'block w-32',
              key: 'from',
              type: 'select',
              templateOptions: {
                translate: true,
                options: this.dataWorkingTimes,
                labelProp: 'name',
                valueProp: 'value',
                size: 'm',
                label: 'from',
                textfieldLabelOutside: false,
              },
            },
            {
              className: 'block w-32',
              key: 'to',
              type: 'select',
              templateOptions: {
                translate: true,
                options: this.dataWorkingTimes,
                labelProp: 'name',
                valueProp: 'value',
                size: 'm',
                label: 'to',
                textfieldLabelOutside: false,
              },
            },
          ],
        },
      },
      {
        key: 'day3',
        type: 'checkbox-labeled',
        templateOptions: {
          labelClassName: 'font-semibold',
        },
        expressionProperties: {
          'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.tuesday'),
        },
        defaultValue: true,
      },
      {
        className: 'col-span-3',
        key: 'tuesdayTime',
        type: 'repeat',
        fieldArray: {
          fieldGroupClassName: 'flex space-x-4',
          fieldGroup: [
            {
              className: 'block w-32',
              key: 'from',
              type: 'select',
              templateOptions: {
                translate: true,
                options: this.dataWorkingTimes,
                labelProp: 'name',
                valueProp: 'value',
                size: 'm',
                label: 'from',
                textfieldLabelOutside: false,
              },
            },
            {
              className: 'block w-32',
              key: 'to',
              type: 'select',
              templateOptions: {
                translate: true,
                options: this.dataWorkingTimes,
                labelProp: 'name',
                valueProp: 'value',
                size: 'm',
                label: 'to',
                textfieldLabelOutside: false,
              },
            },
          ],
        },
      },
      {
        key: 'day4',
        type: 'checkbox-labeled',
        templateOptions: {
          labelClassName: 'font-semibold',
        },
        expressionProperties: {
          'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.wednesday'),
        },
        defaultValue: true,
      },
      {
        className: 'col-span-3',
        key: 'wednesdayTime',
        type: 'repeat',
        fieldArray: {
          fieldGroupClassName: 'flex space-x-4',
          fieldGroup: [
            {
              className: 'block w-32',
              key: 'from',
              type: 'select',
              templateOptions: {
                translate: true,
                options: this.dataWorkingTimes,
                labelProp: 'name',
                valueProp: 'value',
                size: 'm',
                label: 'from',
                textfieldLabelOutside: false,
              },
            },
            {
              className: 'block w-32',
              key: 'to',
              type: 'select',
              templateOptions: {
                translate: true,
                options: this.dataWorkingTimes,
                labelProp: 'name',
                valueProp: 'value',
                size: 'm',
                label: 'to',
                textfieldLabelOutside: false,
              },
            },
          ],
        },
      },
      {
        key: 'day5',
        type: 'checkbox-labeled',
        templateOptions: {
          labelClassName: 'font-semibold',
        },
        expressionProperties: {
          'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.thursday'),
        },
        defaultValue: true,
      },
      {
        className: 'col-span-3',
        key: 'thursdayTime',
        type: 'repeat',
        fieldArray: {
          fieldGroupClassName: 'flex space-x-4',
          fieldGroup: [
            {
              className: 'block w-32',
              key: 'from',
              type: 'select',
              templateOptions: {
                translate: true,
                options: this.dataWorkingTimes,
                labelProp: 'name',
                valueProp: 'value',
                size: 'm',
                label: 'from',
                textfieldLabelOutside: false,
              },
            },
            {
              className: 'block w-32',
              key: 'to',
              type: 'select',
              templateOptions: {
                translate: true,
                options: this.dataWorkingTimes,
                labelProp: 'name',
                valueProp: 'value',
                size: 'm',
                label: 'to',
                textfieldLabelOutside: false,
              },
            },
          ],
        },
      },
      {
        key: 'day6',
        type: 'checkbox-labeled',
        templateOptions: {
          labelClassName: 'font-semibold',
        },
        expressionProperties: {
          'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.friday'),
        },
        defaultValue: true,
      },
      {
        className: 'col-span-3',
        key: 'fridayTime',
        type: 'repeat',
        fieldArray: {
          fieldGroupClassName: 'flex space-x-4',
          fieldGroup: [
            {
              className: 'block w-32',
              key: 'from',
              type: 'select',
              templateOptions: {
                translate: true,
                options: this.dataWorkingTimes,
                labelProp: 'name',
                valueProp: 'value',
                size: 'm',
                label: 'from',
                textfieldLabelOutside: false,
              },
            },
            {
              className: 'block w-32',
              key: 'to',
              type: 'select',
              templateOptions: {
                translate: true,
                options: this.dataWorkingTimes,
                labelProp: 'name',
                valueProp: 'value',
                size: 'm',
                label: 'to',
                textfieldLabelOutside: false,
              },
            },
          ],
        },
      },
      {
        key: 'day7',
        type: 'checkbox-labeled',
        templateOptions: {
          labelClassName: 'font-semibold',
        },
        expressionProperties: {
          'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.saturday'),
        },
        defaultValue: true,
      },
      {
        className: 'col-span-3',
        key: 'saturdayTime',
        type: 'repeat',
        fieldArray: {
          fieldGroupClassName: 'flex space-x-4',
          fieldGroup: [
            {
              className: 'block w-32',
              key: 'from',
              type: 'select',
              templateOptions: {
                translate: true,
                options: this.dataWorkingTimes,
                labelProp: 'name',
                valueProp: 'value',
                size: 'm',
                label: 'from',
                textfieldLabelOutside: false,
              },
            },
            {
              className: 'block w-32',
              key: 'to',
              type: 'select',
              templateOptions: {
                translate: true,
                options: this.dataWorkingTimes,
                labelProp: 'name',
                valueProp: 'value',
                size: 'm',
                label: 'to',
                textfieldLabelOutside: false,
              },
            },
          ],
        },
      },
      {
        key: 'day1',
        type: 'checkbox-labeled',
        templateOptions: {
          labelClassName: 'font-semibold',
        },
        expressionProperties: {
          'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.sunday'),
        },
        defaultValue: true,
      },
      {
        className: 'col-span-3',
        key: 'sundayTime',
        type: 'repeat',
        fieldArray: {
          fieldGroupClassName: 'flex space-x-4',
          fieldGroup: [
            {
              className: 'block w-32',
              key: 'from',
              type: 'select',
              templateOptions: {
                translate: true,
                options: this.dataWorkingTimes,
                labelProp: 'name',
                valueProp: 'value',
                size: 'm',
                label: 'from',
                textfieldLabelOutside: false,
              },
            },
            {
              className: 'block w-32',
              key: 'to',
              type: 'select',
              templateOptions: {
                translate: true,
                options: this.dataWorkingTimes,
                labelProp: 'name',
                valueProp: 'value',
                size: 'm',
                label: 'to',
                textfieldLabelOutside: false,
              },
            },
          ],
        },
      },
      {
        key: 'checkInAfter',
        type: 'input-time',
        templateOptions: {
          translate: true,
          textfieldLabelOutside: true,
          required: true,
          label: `${TRANSLATION_SCOPE}.morningCheckInBefore`,
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
          label: `${TRANSLATION_SCOPE}.afternoonCheckOutAfter`,
          labelClassName: 'font-semibold',
        },
      },
      {
        key: 'startLunch',
        type: 'input-time',
        templateOptions: {
          translate: true,
          label: `${TRANSLATION_SCOPE}.startLunch`,
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
          label: `${TRANSLATION_SCOPE}.endLunch`,
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
          label: `${TRANSLATION_SCOPE}.minimumWorkingHours`,
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
          label: `${TRANSLATION_SCOPE}.maximumWorkingHours`,
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
          label: `${TRANSLATION_SCOPE}.startTime`,
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
          label: `${TRANSLATION_SCOPE}.endTime`,
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
          label: `${TRANSLATION_SCOPE}.maxPaidLeaveToCash`,
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
          label: `${TRANSLATION_SCOPE}.useTimekeeper`,
        },
      },
      {
        key: 'convertOT',
        className: 'col-span-2',
        type: 'select',
        defaultValue: ConvertOvertime.none,
        templateOptions: {
          translate: true,
          label: `${TRANSLATION_SCOPE}.convertOT`,
          labelClassName: 'font-semibold',
          valueProp: 'value',
          options: this.translocoService.selectTranslateObject('CONVERT_OT_OPTIONS', {}, TRANSLATION_SCOPE).pipe(
            map((result) => [
              { label: result.none, value: ConvertOvertime.none },
              { label: result.payroll, value: ConvertOvertime.payroll },
              { label: result.paidLeave, value: ConvertOvertime.paidLeave },
            ])
          ),
        },
      },
      {
        key: 'maximumPeriodTimeCheckOutInApp',
        type: 'input-time',
        templateOptions: {
          translate: true,
          label: `${TRANSLATION_SCOPE}.maximumPeriodTimeCheckOutInApp`,
          labelClassName: 'font-semibold',
          textfieldLabelOutside: true,
          required: true,
        },
      },
      { key: 'id' },
    ];
    this.workingTimesService
      .getOrgs()
      .pipe(
        map((res) => res.data.items.find((org) => org.id === this.authService.get('userInfo', 'orgId'))),
        filter(isPresent),
        takeUntil(this.destroy$)
      )
      .subscribe((org) => this.orgControl.setValue(org));

    this.request$.pipe(filter(isPresent), takeUntil(this.destroy$)).subscribe((data) => {
      this.patchFormValue(data);
    });
  }

  saveSettings(): void {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      const formModel = { ...this.form.value };
      const orgControlData = this.orgControl.value;
      const items: any[] = [];
      const dayTime = [
        formModel.sundayTime,
        formModel.mondayTime,
        formModel.tuesdayTime,
        formModel.wednesdayTime,
        formModel.thursdayTime,
        formModel.fridayTime,
        formModel.saturdayTime,
      ];
      const dayKey = [
        formModel.day1,
        formModel.day2,
        formModel.day3,
        formModel.day4,
        formModel.day5,
        formModel.day6,
        formModel.day7,
      ];

      for (let i = 1; i <= 7; i++) {
        let values = dayKey[i - 1] ? dayTime[i - 1] : [];

        if (!values[0].from || !values[0].to) {
          values = [];
        }
        items.push({
          weekDayId: i,
          values,
          configType: 0,
        });
      }
      this.settingsElement = {
        id: formModel.id,
        orgId: orgControlData.id,
        checkInAfter: (formModel?.checkInAfter as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000,
        checkOutBefore: (formModel?.checkOutBefore as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000,
        workingHour: (formModel?.workingHour as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000,
        startLunch: (formModel?.startLunch as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000,
        endLunch: (formModel?.endLunch as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000,
        totalWorkingHour: (formModel?.totalWorkingHour as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000,
        startTimeInWorkingDay: (formModel?.startTimeInWorkingDay as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000,
        endTimeInWorkingDay: (formModel?.endTimeInWorkingDay as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000,
        maximumPeriodTimeCheckOutInApp:
          (formModel?.maximumPeriodTimeCheckOutInApp as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000,
        fingerPrint: formModel.fingerPrint,
        timePayroll: formModel.convertOT === ConvertOvertime.payroll,
        timePaidLeave: formModel.convertOT === ConvertOvertime.paidLeave,
        items: items,
      };
      if (this.workingHourId) {
        this.settingsElement.id = this.workingHourId;
      }
      this.workingTimesService
        .saveSettings(this.settingsElement)
        .pipe(
          mapTo({ icon: 'success', html: '<b>Update Settings Time Successfully!</b>' } as SweetAlertOptions),
          takeUntil(this.destroy$),
          catchError((err) =>
            of({
              icon: 'error',
              text: err.error.message,
              showCancelButton: true,
              showConfirmButton: false,
            } as SweetAlertOptions)
          ),
          switchMap((options) => this.promptService.open(options)),
          filter((result) => result.isConfirmed),
          takeUntil(this.destroy$)
        )
        .subscribe();
    }
  }

  private patchFormValue(formData: any): void {
    const formModel = formData.data;
    this.workingHourId = formModel?.id;
    const jsonEditData = {
      id: formModel.id,
      orgId: formModel.myOrgId,
      mondayTime: {},
      tuesdayTime: {},
      wednesdayTime: {},
      thursdayTime: {},
      fridayTime: {},
      saturdayTime: {},
      sundayTime: {},
      maxPaidLeaveToCash: formModel.maxPaidLeaveToCash,
      checkInAfter: new TuiTime(
        Number(secondsToTime(formModel.checkInAfter).h),
        Number(secondsToTime(formModel.checkInAfter).m)
      ),
      checkOutBefore: new TuiTime(
        Number(secondsToTime(formModel.checkOutBefore).h),
        Number(secondsToTime(formModel.checkOutBefore).m)
      ),
      workingHour: new TuiTime(
        Number(secondsToTime(formModel.workingHour).h),
        Number(secondsToTime(formModel.workingHour).m)
      ),
      startLunch: new TuiTime(
        Number(secondsToTime(formModel.startLunch).h),
        Number(secondsToTime(formModel.startLunch).m)
      ),
      endLunch: new TuiTime(Number(secondsToTime(formModel.endLunch).h), Number(secondsToTime(formModel.endLunch).m)),
      totalWorkingHour: new TuiTime(
        Number(secondsToTime(formModel.totalWorkingHour).h),
        Number(secondsToTime(formModel.totalWorkingHour).m)
      ),
      startTimeInWorkingDay: new TuiTime(
        Number(secondsToTime(formModel.startTimeInWorkingDay).h),
        Number(secondsToTime(formModel.startTimeInWorkingDay).m)
      ),
      endTimeInWorkingDay: new TuiTime(
        Number(secondsToTime(formModel.endTimeInWorkingDay).h),
        Number(secondsToTime(formModel.endTimeInWorkingDay).m)
      ),
      maximumPeriodTimeCheckOutInApp: TuiTime.fromAbsoluteMilliseconds(formModel.maximumPeriodTimeCheckOutInApp * 1000),
      fingerPrint: formModel.fingerPrint,
      convertOT: formModel.timePayroll
        ? ConvertOvertime.payroll
        : formModel.timePaidLeave
        ? ConvertOvertime.paidLeave
        : ConvertOvertime.none,
    };

    const DayDefault = [{ from: '', to: '' }];
    formModel?.items?.forEach(function (res: any) {
      if (res.weekDayId === 2) {
        jsonEditData.mondayTime = res.totalTime > 0 ? res.values : DayDefault;
      }
      if (res.weekDayId === 3) {
        jsonEditData.tuesdayTime = res.totalTime > 0 ? res.values : DayDefault;
      }
      if (res.weekDayId === 4) {
        jsonEditData.wednesdayTime = res.totalTime > 0 ? res.values : DayDefault;
      }
      if (res.weekDayId === 5) {
        jsonEditData.thursdayTime = res.totalTime > 0 ? res.values : DayDefault;
      }
      if (res.weekDayId === 6) {
        jsonEditData.fridayTime = res.totalTime > 0 ? res.values : DayDefault;
      }
      if (res.weekDayId === 7) {
        jsonEditData.saturdayTime = res.totalTime > 0 ? res.values : DayDefault;
      }
      if (res.weekDayId === 1) {
        jsonEditData.sundayTime = res.totalTime > 0 ? res.values : DayDefault;
      }
    });
    this.model = { ...this.model, ...jsonEditData };
  }
}
