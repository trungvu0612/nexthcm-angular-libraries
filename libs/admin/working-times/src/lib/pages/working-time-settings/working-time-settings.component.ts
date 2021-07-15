import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDay } from '@taiga-ui/cdk';
import { DefaultConfig } from 'ngx-easy-table';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { WORKING_TIMES } from '../../models/working-times';
import { WorkingTimesService } from '../../services/working-times.service';

@Component({
  selector: 'hcm-working-time-settings',
  templateUrl: './working-time-settings.component.html',
  styleUrls: ['./working-time-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkingTimeSettingsComponent implements OnInit {
  activeItemIndex = 0;
  settingsElement: any;
  dataSettings$ = this.workingTimesService.getSettings().pipe(map((res) => res.data.items));
  public configuration?: any;
  public columns?: any;
  public dataHoliday: any[] = [];
  dataWorkingTimes = WORKING_TIMES;
  readonly form = new FormGroup({
    filters: new FormControl([]),
    mondayTime: new FormArray([]),
    tuesdayTime: new FormArray([]),
    wednesdayTime: new FormArray([]),
    thursdayTime: new FormArray([]),
    fridayTime: new FormArray([]),

    checkInAfter: new FormControl(10),
    checkOutBefore: new FormControl(10),
    workingHour: new FormControl(2),
    totalWorkingHour: new FormControl(8),
    lunchHours: new FormControl(1),
    workflow: new FormControl('Workflow OT'),
    fingerPrint: new FormControl(true),
    timePayroll: new FormControl(true),
    timePaidLeave: new FormControl(false)
  });
  readonly holidayForm = new FormGroup({
    holidayValue: new FormControl(),
    holidayName: new FormControl(),
    repeatYearly: new FormControl(true)
  });

  primary = 'Workflow OT';
  showDropdown = true;
  model: any = {
    mondayTime: [{}],
    tuesdayTime: [{}],
    wednesdayTime: [{}],
    thursdayTime: [{}],
    fridayTime: [{}]
  };
  readonly workflowData = ['Workflow OT', 'Workflow others'];

  open = false;
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
            templateOptions: { textfieldLabelOutside: true, size: 'm' },
            defaultValue: false
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
            templateOptions: { textfieldLabelOutside: true, size: 'm' },
            defaultValue: false
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
            templateOptions: { textfieldLabelOutside: true, size: 'm' },
            defaultValue: false
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
            templateOptions: { textfieldLabelOutside: true, size: 'm' },
            defaultValue: false
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
            templateOptions: { textfieldLabelOutside: true, size: 'm' },
            defaultValue: false
          }
        ]
      }
    }
  ];

  constructor(private cdr: ChangeDetectorRef,
              private workingTimesService: WorkingTimesService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.configuration = { ...DefaultConfig };
    this.configuration.searchEnabled = true;

    this.columns = [
      { key: 'timeHoliday', title: 'Date' },
      { key: 'nameHoliday', title: 'Holiday' },
      { key: 'yearly', title: 'Repeat yearly' },
      { key: 'action', title: '' }
    ];
    this.cdr.detectChanges();
  }

  saveSettings() {
    const formModel = this.form.value;
    const items: any[] = [];
    const dayTime = [formModel.mondayTime, formModel.tuesdayTime, formModel.wednesdayTime, formModel.thursdayTime, formModel.fridayTime];
    const dayKey = [formModel.day2, formModel.day3, formModel.day4, formModel.day5, formModel.day6];
    for (let i = 2; i < 7; i++) {
      const m: number = i - 2;
      if (dayKey[m] == true) {
        items.push(
          {
            weekDayId: i,
            values: dayTime[m]
          }
        );
      }
    }
    this.settingsElement = {
      'checkInAfter': formModel.checkInAfter,
      'checkOutBefore': formModel.checkOutBefore,
      'workingHour': formModel.workingHour,
      'totalWorkingHour': formModel.totalWorkingHour,
      'lunchHours': formModel.lunchHours,
      'fingerPrint': formModel.fingerPrint,
      'timePayroll': formModel.timePayroll,
      'timePaidLeave': formModel.timePaidLeave,
      'items': items,
      'holiday': this.dataHoliday
    };
    // console.log(JSON.stringify(this.settingsElement));
    this.workingTimesService.saveSettings(this.settingsElement).subscribe((item) => {
      console.log(item);
    });

  }

  onClick(item: string) {
    this.showDropdown = !this.showDropdown;
    if (this.workflowData[0].indexOf(item) !== -1) {
      this.primary = item;
      return;
    }
  }

  addHolidayTime() {
    this.dataHoliday.push({
      holidayTime: (this.holidayForm.controls['holidayValue'].value as TuiDay).toLocalNativeDate().valueOf(),
      holidayName: this.holidayForm.controls['holidayName'].value,
      yearly: this.holidayForm.controls['repeatYearly'].value
    });
    this.dataHoliday = [...this.dataHoliday];
    this.cdr.detectChanges();
  }

  removeHoliday(index: number) {
    // delete this.dataHoliday[index];
    this.dataHoliday.splice(index, 1);
    console.log(this.dataHoliday);
    this.dataHoliday = [...this.dataHoliday];
    this.cdr.detectChanges();
  }
}
