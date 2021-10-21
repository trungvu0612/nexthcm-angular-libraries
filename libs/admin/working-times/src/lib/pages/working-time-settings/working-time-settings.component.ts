import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@nexthcm/auth';
import { Holiday, PromptService, secondsToTime } from '@nexthcm/cdk';
import { FormControl } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import {
  isPresent,
  TuiContextWithImplicit,
  TuiDay,
  TuiDestroyService,
  tuiPure,
  TuiStringHandler,
  TuiTime,
} from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { Columns, DefaultConfig } from 'ngx-easy-table';
import { Observable, of } from 'rxjs';
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
import { Organization } from '../../models/organization';
import { WORKING_HOLIDAY, WORKING_TIMES, WorkingTimes } from '../../models/working-times';
import { WorkingTimesService } from '../../services/working-times.service';

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
  readonly orgControl = new FormControl<Organization>();
  activeItemIndex = 0;
  settingsElement: any;
  workingHourId: any;
  orgLevel: any;
  public configuration?: any;
  public dataHoliday: any[] = [];
  dataWorkingTimes = WORKING_TIMES;
  dataWorkingHoliday = WORKING_HOLIDAY;
  readonly form = new FormGroup({
    filters: new FormControl([]),
    mondayTime: new FormArray([]),
    tuesdayTime: new FormArray([]),
    wednesdayTime: new FormArray([]),
    thursdayTime: new FormArray([]),
    fridayTime: new FormArray([]),
    saturdayTime: new FormArray([]),
    sundayTime: new FormArray([]),
    checkOutBefore: new FormControl(),
    workingHour: new FormControl(),
    totalWorkingHour: new FormControl(),
    startLunch: new FormControl(),
    endLunch: new FormControl(),
    fingerPrint: new FormControl(true),
    startTimeInWorkingDay: new FormControl(),
    endTimeInWorkingDay: new FormControl(),
    ingerPrint: new FormControl(),
    timePayroll: new FormControl(true),
    timePaidLeave: new FormControl(false),
  });
  readonly formHoliday = new FormGroup({});

  public columns$: Observable<Columns[]> = this.translocoService.selectTranslateObject('SETTING_TIME').pipe(
    map((result) => [
      { key: 'holidayDate', title: result.dateHoliday },
      { key: 'name', title: result.holidayName },
      { key: 'paidHoliday', title: result.paidHoliday },
      { key: 'recurringType', title: result.repeat },
      { key: 'action', title: '' },
    ])
  );

  model: any = {
    mondayTime: [{}],
    tuesdayTime: [{}],
    wednesdayTime: [{}],
    thursdayTime: [{}],
    fridayTime: [{}],
    saturdayTime: [{}],
    sundayTime: [{}],
  } as WorkingTimes;

  modelHoliday: any = {} as Holiday;

  fields: FormlyFieldConfig[] = [
    {
      className: 'checkbox-day',
      key: 'day2',
      type: 'checkbox',
      templateOptions: {
        textfieldLabelOutside: true,
        size: 'm',
      },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.monday'),
      },
      defaultValue: true,
    },
    {
      className: 'col-span-2',
      key: 'mondayTime',
      type: 'repeat',
      templateOptions: {},
      fieldArray: {
        fieldGroup: [
          {
            className: 'inline',
            key: 'from',
            type: 'select',
            templateOptions: {
              options: this.dataWorkingTimes,
              labelProp: 'name',
              valueProp: 'value',
              size: 'm',
            },
          },
          {
            className: 'inline',
            key: 'to',
            type: 'select',
            templateOptions: {
              options: this.dataWorkingTimes,
              labelProp: 'name',
              valueProp: 'value',
              size: 'm',
            },
            expressionProperties: {
              'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.to'),
            },
          },
        ],
      },
    },
    {
      className: 'checkbox-day',
      key: 'day3',
      type: 'checkbox',
      templateOptions: {
        textfieldLabelOutside: true,
        size: 'm',
      },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.tuesday'),
      },
      defaultValue: true,
    },
    {
      className: 'col-span-2',
      key: 'tuesdayTime',
      type: 'repeat',
      templateOptions: {},
      fieldArray: {
        fieldGroup: [
          {
            className: 'inline',
            key: 'from',
            type: 'select',
            templateOptions: {
              options: this.dataWorkingTimes,
              labelProp: 'name',
              valueProp: 'value',
              size: 'm',
            },
          },
          {
            className: 'inline',
            key: 'to',
            type: 'select',
            templateOptions: {
              options: this.dataWorkingTimes,
              labelProp: 'name',
              valueProp: 'value',
              size: 'm',
            },
            expressionProperties: {
              'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.to'),
            },
          },
        ],
      },
    },
    {
      className: 'checkbox-day',
      key: 'day4',
      type: 'checkbox',
      templateOptions: {
        textfieldLabelOutside: true,
        size: 'm',
      },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.wednesday'),
      },
      defaultValue: true,
    },
    {
      className: 'col-span-2',
      key: 'wednesdayTime',
      type: 'repeat',
      templateOptions: {},
      fieldArray: {
        fieldGroup: [
          {
            className: 'inline',
            key: 'from',
            type: 'select',
            templateOptions: {
              options: this.dataWorkingTimes,
              labelProp: 'name',
              valueProp: 'value',
              size: 'm',
            },
          },
          {
            className: 'inline',
            key: 'to',
            type: 'select',
            templateOptions: {
              options: this.dataWorkingTimes,
              labelProp: 'name',
              valueProp: 'value',
              size: 'm',
            },
            expressionProperties: {
              'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.to'),
            },
          },
        ],
      },
    },
    {
      className: 'checkbox-day',
      key: 'day5',
      type: 'checkbox',
      templateOptions: {
        textfieldLabelOutside: true,
        size: 'm',
      },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.thursday'),
      },
      defaultValue: true,
    },
    {
      className: 'col-span-2',
      key: 'thursdayTime',
      type: 'repeat',
      templateOptions: {},
      fieldArray: {
        fieldGroup: [
          {
            className: 'inline',
            key: 'from',
            type: 'select',
            templateOptions: {
              options: this.dataWorkingTimes,
              labelProp: 'name',
              valueProp: 'value',
              size: 'm',
            },
          },
          {
            className: 'inline',
            key: 'to',
            type: 'select',
            templateOptions: {
              options: this.dataWorkingTimes,
              labelProp: 'name',
              valueProp: 'value',
              size: 'm',
            },
            expressionProperties: {
              'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.to'),
            },
          },
        ],
      },
    },
    {
      className: 'checkbox-day',
      key: 'day6',
      type: 'checkbox',
      templateOptions: {
        textfieldLabelOutside: true,
        size: 'm',
      },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.friday'),
      },
      defaultValue: true,
    },
    {
      className: 'col-span-2',
      key: 'fridayTime',
      type: 'repeat',
      templateOptions: {},
      fieldArray: {
        fieldGroup: [
          {
            className: 'inline',
            key: 'from',
            type: 'select',
            templateOptions: {
              options: this.dataWorkingTimes,
              labelProp: 'name',
              valueProp: 'value',
              size: 'm',
            },
          },
          {
            className: 'inline',
            key: 'to',
            type: 'select',
            templateOptions: {
              options: this.dataWorkingTimes,
              labelProp: 'name',
              valueProp: 'value',
              size: 'm',
            },
            expressionProperties: {
              'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.to'),
            },
          },
        ],
      },
    },
    {
      className: 'checkbox-day',
      key: 'day7',
      type: 'checkbox',
      templateOptions: {
        textfieldLabelOutside: true,
        size: 'm',
      },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.saturday'),
      },
      defaultValue: false,
    },
    {
      className: 'col-span-2',
      key: 'saturdayTime',
      type: 'repeat',
      templateOptions: {},
      fieldArray: {
        fieldGroup: [
          {
            className: 'inline',
            key: 'from',
            type: 'select',
            templateOptions: {
              options: this.dataWorkingTimes,
              labelProp: 'name',
              valueProp: 'value',
              size: 'm',
            },
          },
          {
            className: 'inline',
            key: 'to',
            type: 'select',
            templateOptions: {
              options: this.dataWorkingTimes,
              labelProp: 'name',
              valueProp: 'value',
              size: 'm',
            },
            expressionProperties: {
              'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.to'),
            },
          },
        ],
      },
    },
    {
      className: 'checkbox-day',
      key: 'day1',
      type: 'checkbox',
      templateOptions: {
        textfieldLabelOutside: true,
        size: 'm',
      },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.sunday'),
      },
      defaultValue: false,
    },
    {
      className: 'col-span-2',
      key: 'sundayTime',
      type: 'repeat',
      templateOptions: {},
      fieldArray: {
        fieldGroup: [
          {
            className: 'inline',
            key: 'from',
            type: 'select',
            templateOptions: {
              options: this.dataWorkingTimes,
              labelProp: 'name',
              valueProp: 'value',
              size: 'm',
            },
          },
          {
            className: 'inline',
            key: 'to',
            type: 'select',
            templateOptions: {
              options: this.dataWorkingTimes,
              labelProp: 'name',
              valueProp: 'value',
              size: 'm',
            },
            expressionProperties: {
              'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.to'),
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
        label: 'offMorning',
        placeholder: 'checkInAfter',
      },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.offMorning'),
        'templateOptions.placeholder': this.translocoService.selectTranslate('SETTING_TIME.checkInAfter'),
      },
    },
    {
      key: 'checkOutBefore',
      type: 'input-time',
      templateOptions: {
        label: 'offAfternoon',
        textfieldLabelOutside: true,
        required: true,
        placeholder: 'checkOutBefore',
      },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.offAfternoon'),
        'templateOptions.placeholder': this.translocoService.selectTranslate('SETTING_TIME.checkOutBefore'),
      },
    },
    {
      key: 'workingHour',
      type: 'input-time',
      templateOptions: {
        label: 'employeeOfWorking',
        textfieldLabelOutside: true,
        required: true,
      },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.employeeOfWorking'),
      },
    },
    {
      key: 'startLunch',
      type: 'input-time',
      templateOptions: {
        label: 'startLunch',
        textfieldLabelOutside: true,
        required: true,
      },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.startLunch'),
      },
    },
    {
      key: 'endLunch',
      type: 'input-time',
      templateOptions: {
        label: 'endLunch',
        textfieldLabelOutside: true,
        required: true,
      },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.endLunch'),
      },
    },
    {
      key: 'totalWorkingHour',
      type: 'input-time',
      templateOptions: {
        label: 'totalWorkingDay',
        textfieldLabelOutside: true,
        required: true,
      },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.totalWorkingDay'),
      },
    },
    {
      key: 'startTimeInWorkingDay',
      type: 'input-time',
      templateOptions: {
        label: 'startWorkingTime',
        textfieldLabelOutside: true,
        required: true,
      },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.startWorkingTime'),
      },
    },
    {
      key: 'endTimeInWorkingDay',
      type: 'input-time',
      templateOptions: {
        label: 'endWorkingTime',
        textfieldLabelOutside: true,
        required: true,
      },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.endWorkingTime'),
      },
    },
    {
      key: 'fingerPrint',
      className: 'tui-form__row block',
      type: 'toggle',
      templateOptions: { textfieldLabelOutside: true, size: 'l' },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.fingerPrint'),
      },
    },
    {
      key: 'maxPaidLeaveToCash',
      type: 'input-count',
      templateOptions: {
        textfieldLabelOutside: true,
        required: true,
      },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('maxPaidLeaveToCash'),
      },
    },
    {
      className: 'block mb-5',
      key: 'timePayroll',
      type: 'checkbox-labeled',
      defaultValue: false,
      templateOptions: {
        translate: true,
        label: 'otPayroll',
        size: 'l',
      },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.otPayroll'),
      },
    },
    {
      className: 'block mb-5',
      key: 'timePaidLeave',
      type: 'checkbox-labeled',
      defaultValue: false,
      templateOptions: {
        translate: true,
        label: 'otPaidLeave',
        size: 'l',
      },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.otPaidLeave'),
      },
    },
  ];

  fieldsHoliday: FormlyFieldConfig[] = [
    {
      key: 'holidayDate',
      className: 'block',
      type: 'input-date',
      templateOptions: {
        translate: true,
        label: '',
        labelClassName: 'font-semibold',
      },
    },
    {
      key: 'name',
      className: 'block',
      type: 'input',
      templateOptions: {
        translate: true,
        textfieldLabelOutside: true,
        placeholder: 'holidayName',
      },
      expressionProperties: {
        'templateOptions.placeholder': this.translocoService.selectTranslate('SETTING_TIME.holidayName'),
      },
    },
    {
      className: 'inline',
      key: 'recurringType',
      type: 'select',
      templateOptions: {
        translate: true,
        textfieldLabelOutside: true,
        placeholder: 'holidayType',
        options: this.dataWorkingHoliday,
        labelProp: 'name',
        valueProp: 'value',
        size: 'm',
      },
      expressionProperties: {
        'templateOptions.placeholder': this.translocoService.selectTranslate('SETTING_TIME.holidayType'),
      },
    },
    {
      className: 'block mt-3',
      key: 'paidHoliday',
      type: 'checkbox-labeled',
      defaultValue: true,
      templateOptions: {
        translate: true,
        label: 'paidHoliday',
        size: 'l',
      },
      expressionProperties: {
        'templateOptions.label': this.translocoService.selectTranslate('SETTING_TIME.paidHoliday'),
      },
    },
  ];
  orgTree$ = this.workingTimesService.getOrganizationChart(this.authService.get('userInfo', 'tenantId') as string);

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

  ngAfterViewInit() {
    this.configuration = { ...DefaultConfig, paginationEnabled: false };
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

    this.workingTimesService.getHoliday().subscribe((item) => {
      item.data.items.forEach((item) => {
        this.dataHoliday.push({
          holidayDate: item.holidayDate,
          name: item.name,
          recurringType: item.recurringType,
          paidHoliday: item.paidHoliday,
          id: item.id,
        });
      });
      this.dataHoliday = [...this.dataHoliday];
      this.cdr.detectChanges();
    });
    this.cdr.detectChanges();
  }

  saveSettings() {
    const formModel = this.form.value;
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
      const m: number = i - 1;
      if (dayKey[m] == true) {
        items.push({
          weekDayId: i,
          values: dayTime[m],
        });
      } else {
        items.push({
          weekDayId: i,
          values: [],
        });
      }
    }
    this.settingsElement = {
      orgId: orgControlData.id,
      checkInAfter: (formModel?.checkInAfter as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000,
      checkOutBefore: (formModel?.checkOutBefore as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000,
      workingHour: (formModel?.workingHour as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000,
      startLunch: (formModel?.startLunch as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000,
      endLunch: (formModel?.endLunch as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000,
      totalWorkingHour: (formModel?.totalWorkingHour as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000,
      startTimeInWorkingDay: (formModel?.startTimeInWorkingDay as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000,
      endTimeInWorkingDay: (formModel?.endTimeInWorkingDay as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000,
      fingerPrint: formModel.fingerPrint,
      timePayroll: formModel.timePayroll,
      timePaidLeave: formModel.timePaidLeave,
      items: items,
    };
    if (this.workingHourId) {
      this.settingsElement.id = this.workingHourId;
    }
    this.workingTimesService
      .saveSettings(this.settingsElement)
      .pipe(
        mapTo({ icon: 'success', text: 'Update Settings Time Successfully!' } as SweetAlertOptions),
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
      .subscribe(() => this.router.navigate(['../..'], { relativeTo: this.activatedRoute }));
  }

  addHolidayTime() {
    if (this.formHoliday?.controls['holidayDate'].value && this.formHoliday?.controls['name'].value) {
      const dataAddHoliday = {
        holidayDate: (this.formHoliday?.controls['holidayDate'].value as TuiDay).toLocalNativeDate().valueOf(),
        name: this.formHoliday?.controls['name'].value,
        recurringType: this.formHoliday?.controls['recurringType'].value,
        paidHoliday: this.formHoliday?.controls['paidHoliday'].value,
      };

      this.workingTimesService.addHoliday(dataAddHoliday).subscribe((item) => {
        this.dataHoliday.push({
          holidayDate: item.data.holidayDate,
          name: item.data.name,
          recurringType: item.data.recurringType,
          paidHoliday: item.data.paidHoliday,
          id: item.data.id,
        });
        this.dataHoliday = [...this.dataHoliday];
        this.cdr.detectChanges();
      });
    }
  }

  removeHoliday(index: number, id: any) {
    this.workingTimesService.deleteHoliday(id).subscribe((item) => {
      this.dataHoliday.splice(index, 1);
      this.dataHoliday = [...this.dataHoliday];
      this.cdr.detectChanges();
    });
  }

  private patchFormValue(formData: any): void {
    const formModel = formData.data;
    this.workingHourId = formModel?.id;
    const jsonEditData = {
      orgId: formModel.myOrgId,
      mondayTime: {},
      tuesdayTime: {},
      wednesdayTime: {},
      thursdayTime: {},
      fridayTime: {},
      saturdayTime: {},
      sundayTime: {},
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
      fingerPrint: formModel.fingerPrint,
      timePayroll: formModel.timePayroll,
      timePaidLeave: formModel.timePaidLeave,
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
