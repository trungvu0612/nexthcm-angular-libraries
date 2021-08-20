import {AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject} from '@angular/core';
import {FormArray, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '@nexthcm/auth';
import {PromptService, secondsToTime} from '@nexthcm/cdk';
import {FormlyFieldConfig} from '@ngx-formly/core';
import {TuiDay, TuiDestroyService, TuiTime} from '@taiga-ui/cdk';
import {TuiDialogService} from '@taiga-ui/core';
import {DefaultConfig} from 'ngx-easy-table';
import {BehaviorSubject, of} from 'rxjs';
import {catchError, filter, mapTo, switchMap, takeUntil} from 'rxjs/operators';
import {SweetAlertOptions} from 'sweetalert2';
import {WORKING_TIMES, WorkingTimes, WORKING_HOLIDAY} from '../../models/working-times';
import {WorkingTimesService} from '../../services/working-times.service';
import {TranslocoService} from '@ngneat/transloco';
import {Holiday} from '../../models/holiday';

@Component({
  selector: 'hcm-working-time-settings',
  templateUrl: './working-time-settings.component.html',
  styleUrls: ['./working-time-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService]
})
export class WorkingTimeSettingsComponent implements AfterViewInit {
  myOrgId = this.authService.get('userInfo').orgId;
  activeItemIndex = 0;
  settingsElement: any;
  workingHourId: any;
  public configuration?: any;
  public columns?: any;
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
    lunchHours: new FormControl(),
    fingerPrint: new FormControl(true),
    timePayroll: new FormControl(true),
    timePaidLeave: new FormControl(false)
  });
  readonly formHoliday = new FormGroup({});

  model: any = {
    mondayTime: [{}],
    tuesdayTime: [{}],
    wednesdayTime: [{}],
    thursdayTime: [{}],
    fridayTime: [{}],
    saturdayTime: [{}],
    sundayTime: [{}]
  } as WorkingTimes;

  modelHoliday: any = {} as Holiday;

  fields: FormlyFieldConfig[] = [
    {
      className: 'checkbox-day',
      key: 'day2',
      type: 'checkbox',
      templateOptions: {
        textfieldLabelOutside: true,
        size: 'm'
      },
      expressionProperties: {
        'templateOptions.label': of('Monday')
      },
      defaultValue: true
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
              size: 'm'
            }
          },
          {
            className: 'inline',
            key: 'to',
            type: 'select',
            templateOptions: {
              options: this.dataWorkingTimes,
              labelProp: 'name',
              valueProp: 'value',
              size: 'm'
            },
            expressionProperties: {
              'templateOptions.label': of('to')
            }
          },
          {
            key: 'workShift',
            type: 'toggle',
            templateOptions: {textfieldLabelOutside: true, size: 'm'},
            defaultValue: true
          }
        ]
      }
    },
    {
      className: 'checkbox-day',
      key: 'day3',
      type: 'checkbox',
      templateOptions: {
        textfieldLabelOutside: true,
        size: 'm'
      },
      expressionProperties: {
        'templateOptions.label': of('Tuesday')
      },
      defaultValue: true
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
              size: 'm'
            }
          },
          {
            className: 'inline',
            key: 'to',
            type: 'select',
            templateOptions: {
              options: this.dataWorkingTimes,
              labelProp: 'name',
              valueProp: 'value',
              size: 'm'
            },
            expressionProperties: {
              'templateOptions.label': of('to')
            }
          },
          {
            key: 'workShift',
            type: 'toggle',
            templateOptions: {textfieldLabelOutside: true, size: 'm'},
            defaultValue: true
          }
        ]
      }
    },
    {
      className: 'checkbox-day',
      key: 'day4',
      type: 'checkbox',
      templateOptions: {
        textfieldLabelOutside: true,
        size: 'm'
      },
      expressionProperties: {
        'templateOptions.label': of('Wednesday')
      },
      defaultValue: true
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
              size: 'm'
            }
          },
          {
            className: 'inline',
            key: 'to',
            type: 'select',
            templateOptions: {
              options: this.dataWorkingTimes,
              labelProp: 'name',
              valueProp: 'value',
              size: 'm'
            },
            expressionProperties: {
              'templateOptions.label': of('to')
            }
          },
          {
            key: 'workShift',
            type: 'toggle',
            templateOptions: {textfieldLabelOutside: true, size: 'm'},
            defaultValue: true
          }
        ]
      }
    },
    {
      className: 'checkbox-day',
      key: 'day5',
      type: 'checkbox',
      templateOptions: {
        textfieldLabelOutside: true,
        size: 'm'
      },
      expressionProperties: {
        'templateOptions.label': of('Thursday')
      },
      defaultValue: true
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
              size: 'm'
            }
          },
          {
            className: 'inline',
            key: 'to',
            type: 'select',
            templateOptions: {
              options: this.dataWorkingTimes,
              labelProp: 'name',
              valueProp: 'value',
              size: 'm'
            },
            expressionProperties: {
              'templateOptions.label': of('to')
            }
          },
          {
            key: 'workShift',
            type: 'toggle',
            templateOptions: {textfieldLabelOutside: true, size: 'm'},
            defaultValue: true
          }
        ]
      }
    },
    {
      className: 'checkbox-day',
      key: 'day6',
      type: 'checkbox',
      templateOptions: {
        textfieldLabelOutside: true,
        size: 'm'
      },
      expressionProperties: {
        'templateOptions.label': of('Friday')
      },
      defaultValue: true
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
              size: 'm'
            }
          },
          {
            className: 'inline',
            key: 'to',
            type: 'select',
            templateOptions: {
              options: this.dataWorkingTimes,
              labelProp: 'name',
              valueProp: 'value',
              size: 'm'
            },
            expressionProperties: {
              'templateOptions.label': of('to')
            }
          },
          {
            key: 'workShift',
            type: 'toggle',
            templateOptions: {textfieldLabelOutside: true, size: 'm'},
            defaultValue: true
          }
        ]
      }
    },
    {
      className: 'checkbox-day',
      key: 'day7',
      type: 'checkbox',
      templateOptions: {
        textfieldLabelOutside: true,
        size: 'm'
      },
      expressionProperties: {
        'templateOptions.label': of('Saturday')
      },
      defaultValue: false
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
              size: 'm'
            }
          },
          {
            className: 'inline',
            key: 'to',
            type: 'select',
            templateOptions: {
              options: this.dataWorkingTimes,
              labelProp: 'name',
              valueProp: 'value',
              size: 'm'
            },
            expressionProperties: {
              'templateOptions.label': of('to')
            }
          },
          {
            key: 'workShift',
            type: 'toggle',
            templateOptions: {textfieldLabelOutside: true, size: 'm'},
            defaultValue: false
          }
        ]
      }
    },
    {
      className: 'checkbox-day',
      key: 'day1',
      type: 'checkbox',
      templateOptions: {
        textfieldLabelOutside: true,
        size: 'm'
      },
      expressionProperties: {
        'templateOptions.label': of('Sunday')
      },
      defaultValue: false
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
              size: 'm'
            }
          },
          {
            className: 'inline',
            key: 'to',
            type: 'select',
            templateOptions: {
              options: this.dataWorkingTimes,
              labelProp: 'name',
              valueProp: 'value',
              size: 'm'
            },
            expressionProperties: {
              'templateOptions.label': of('to')
            }
          },
          {
            key: 'workShift',
            type: 'toggle',
            templateOptions: {textfieldLabelOutside: true, size: 'm'},
            defaultValue: false
          }
        ]
      }
    },
    {
      key: 'checkInAfter',
      type: 'input-time',
      templateOptions: {
        label: 'Employee is off in morning',
        textfieldLabelOutside: true,
        required: true,
        placeholder: 'Check in after'
      }
    },
    {
      key: 'checkOutBefore',
      type: 'input-time',
      templateOptions: {
        label: 'Employee is off in morning',
        textfieldLabelOutside: true,
        required: true,
        placeholder: 'Check out before'
      }
    },
    {
      key: 'workingHour',
      type: 'input-time',
      templateOptions: {
        label: 'Employee is off working',
        textfieldLabelOutside: true,
        required: true,
        placeholder: 'Working hours less than'
      }
    },
    {
      key: 'lunchHours',
      type: 'input-time',
      templateOptions: {
        label: 'Break lunch hours',
        textfieldLabelOutside: true,
        required: true
      }
    },
    {
      key: 'totalWorkingHour',
      type: 'input-time',
      templateOptions: {
        label: 'Total working hours a day',
        textfieldLabelOutside: true,
        required: true
      }
    },
    {
      key: 'fingerPrint',
      className: 'tui-form__row block',
      type: 'toggle',
      templateOptions: {textfieldLabelOutside: true, labelClassName: 'font-semibold'},
      expressionProperties: {
        'templateOptions.label': of('Use FingerPrint')
      }
    },
    {
      className: 'block mb-5',
      key: 'timePayroll',
      type: 'checkbox-labeled',
      defaultValue: false,
      templateOptions: {
        translate: true,
        label: 'Convert OT to payroll',
        size: 'l'
      }
    },
    {
      className: 'block mb-5',
      key: 'timePaidLeave',
      type: 'checkbox-labeled',
      defaultValue: false,
      templateOptions: {
        translate: true,
        label: 'Convert OT to paid leave',
        size: 'l'
      }
    }
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
        placeholder: 'Holiday name',
        labelClassName: 'font-semibold',
      },
    },
    {
      className: 'inline',
      key: 'recurringType',
      type: 'select',
      templateOptions: {
        textfieldLabelOutside: true,
        placeholder: 'Repeat',
        options: this.dataWorkingHoliday,
        labelProp: 'name',
        valueProp: 'value',
        size: 'm',
      },
    },
    {
      className: 'block mb-5',
      key: 'paidHoliday',
      type: 'checkbox-labeled',
      defaultValue: true,
      templateOptions: {
        translate: true,
        label: 'Paid holiday',
        size: 'l',
      },
    },
  ];

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
  ) {
  }

  ngAfterViewInit() {
    this.configuration = {...DefaultConfig, paginationEnabled: false};
    this.columns = [
      {key: 'holidayDate', title: 'Date'},
      {key: 'name', title: 'Holiday'},
      {key: 'paidHoliday', title: 'Paid holiday'},
      {key: 'recurringType', title: 'Repeat'},
      {key: 'action', title: ''}
    ];

    this.workingTimesService.getHoliday().subscribe((item) => {
      item.data.items.forEach((item) => {
        this.dataHoliday.push({
          holidayDate: item.holidayDate,
          name: item.name,
          recurringType: item.recurringType,
          paidHoliday: item.paidHoliday,
          id: item.id
        });
      });
      this.cdr.detectChanges();
    });

    this.workingTimesService.getWorkingHourConfigByOrg(this.myOrgId).subscribe((item) => {
      if (item?.code === 'SUCCESS') {
        this.workingHourId = item?.data?.id;
        const formModel = item.data;
        const jsonEditData = {
          orgId: formModel.myOrgId,
          mondayTime: {},
          tuesdayTime: {},
          wednesdayTime: {},
          thursdayTime: {},
          fridayTime: {},
          saturdayTime: {},
          sundayTime: {},
          checkInAfter: new TuiTime(Number(secondsToTime(formModel.checkInAfter).h), Number(secondsToTime(formModel.checkInAfter).m)),
          checkOutBefore: new TuiTime(Number(secondsToTime(formModel.checkOutBefore).h), Number(secondsToTime(formModel.checkOutBefore).m)),
          workingHour: new TuiTime(Number(secondsToTime(formModel.workingHour).h), Number(secondsToTime(formModel.workingHour).m)),
          lunchHours: new TuiTime(Number(secondsToTime(formModel.lunchHours).h), Number(secondsToTime(formModel.lunchHours).m)),
          totalWorkingHour: new TuiTime(Number(secondsToTime(formModel.totalWorkingHour).h), Number(secondsToTime(formModel.totalWorkingHour).m)),
          fingerPrint: formModel.fingerPrint,
          timePayroll: formModel.timePayroll,
          timePaidLeave: formModel.timePaidLeave
        };

        const DayDefault = [{from: '', to: '', workShift: false}];
        formModel.items.forEach(function (res: any) {
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
        this.model = {...this.model, ...jsonEditData};
      }
    });
    this.cdr.detectChanges();
  }

  saveSettings() {
    const formModel = this.form.value;
    const items = [];
    const dayTime = [
      formModel.sundayTime,
      formModel.mondayTime,
      formModel.tuesdayTime,
      formModel.wednesdayTime,
      formModel.thursdayTime,
      formModel.fridayTime,
      formModel.saturdayTime
    ];
    const dayKey = [
      formModel.day1,
      formModel.day2,
      formModel.day3,
      formModel.day4,
      formModel.day5,
      formModel.day6,
      formModel.day7
    ];
    for (let i = 1; i <= 7; i++) {
      const m: number = i - 1;
      if (dayKey[m] == true) {
        items.push({
          weekDayId: i,
          values: dayTime[m]
        });
      } else {
        items.push({
          weekDayId: i,
          values: []
        });
      }
    }
    this.settingsElement = {
      orgId: formModel.OrgId,
      checkInAfter: ((formModel?.checkInAfter as TuiTime).toAbsoluteMilliseconds().valueOf()) / 1000,
      checkOutBefore: ((formModel?.checkOutBefore as TuiTime).toAbsoluteMilliseconds().valueOf()) / 1000,
      workingHour: ((formModel?.workingHour as TuiTime).toAbsoluteMilliseconds().valueOf()) / 1000,
      lunchHours: ((formModel?.lunchHours as TuiTime).toAbsoluteMilliseconds().valueOf()) / 1000,
      totalWorkingHour: ((formModel?.totalWorkingHour as TuiTime).toAbsoluteMilliseconds().valueOf()) / 1000,
      fingerPrint: formModel.fingerPrint,
      timePayroll: formModel.timePayroll,
      timePaidLeave: formModel.timePaidLeave,
      items: items
    };
    if (this.workingHourId) {
      this.settingsElement.id = this.workingHourId;
    }
    // console.log(JSON.stringify(this.settingsElement));

    this.workingTimesService
      .saveSettings(this.settingsElement)
      .pipe(
        mapTo({icon: 'success', text: 'Update Settings Time Successfully!'} as SweetAlertOptions),
        takeUntil(this.destroy$),
        catchError((err) =>
          of({
            icon: 'error',
            text: err.error.message,
            showCancelButton: true,
            showConfirmButton: false
          } as SweetAlertOptions)
        ),
        switchMap((options) => this.promptService.open(options)),
        filter((result) => result.isConfirmed),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.router.navigate(['../..'], {relativeTo: this.activatedRoute}));
  }

  addHolidayTime() {
    if (this.formHoliday?.controls['holidayDate'].value && this.formHoliday?.controls['name'].value) {
      const dataAddHoliday = {
        holidayDate: (this.formHoliday?.controls['holidayDate'].value as TuiDay).toLocalNativeDate().valueOf(),
        name: this.formHoliday?.controls['name'].value,
        recurringType: this.formHoliday?.controls['recurringType'].value,
        paidHoliday: this.formHoliday?.controls['paidHoliday'].value
      };

      this.workingTimesService.addHoliday(dataAddHoliday).subscribe((item) => {
        this.dataHoliday.push({
          holidayDate: item.data.holidayDate,
          name: item.data.name,
          recurringType: item.data.recurringType,
          paidHoliday: item.data.paidHoliday,
          id: item.data.id
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
}
