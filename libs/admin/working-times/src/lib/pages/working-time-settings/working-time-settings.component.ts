import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptComponent } from '@nexthcm/ui';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDay, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { DefaultConfig } from 'ngx-easy-table';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { catchError, debounceTime, filter, map, mapTo, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { WORKING_TIMES } from '../../models/working-times';
import { WorkingTimesService } from '../../services/working-times.service';

@Component({
  selector: 'hcm-working-time-settings',
  templateUrl: './working-time-settings.component.html',
  styleUrls: ['./working-time-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class WorkingTimeSettingsComponent implements OnInit {
  @ViewChild('prompt') prompt!: PromptComponent;
  page = 0;
  page$ = new BehaviorSubject<number>(1);
  size$ = 10;
  totalLength = 0;
  perPageSubject = new BehaviorSubject<number>(this.size$);

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
    timePaidLeave: new FormControl(false),
  });
  readonly holidayForm = new FormGroup({
    holidayValue: new FormControl(),
    holidayName: new FormControl(),
    repeatYearly: new FormControl(true),
  });

  primary = 'Workflow OT';
  showDropdown = true;
  model: any = {
    mondayTime: [{}],
    tuesdayTime: [{}],
    wednesdayTime: [{}],
    thursdayTime: [{}],
    fridayTime: [{}],
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
        size: 'm',
      },
      expressionProperties: {
        'templateOptions.label': of('Monday'),
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
              'templateOptions.label': of('to'),
            },
          },
          {
            key: 'workShift',
            type: 'toggle',
            templateOptions: { textfieldLabelOutside: true, size: 'm' },
            defaultValue: false,
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
        'templateOptions.label': of('Tuesday'),
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
              'templateOptions.label': of('to'),
            },
          },
          {
            key: 'workShift',
            type: 'toggle',
            templateOptions: { textfieldLabelOutside: true, size: 'm' },
            defaultValue: false,
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
        'templateOptions.label': of('Wednesday'),
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
              'templateOptions.label': of('to'),
            },
          },
          {
            key: 'workShift',
            type: 'toggle',
            templateOptions: { textfieldLabelOutside: true, size: 'm' },
            defaultValue: false,
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
        'templateOptions.label': of('Thursday'),
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
              'templateOptions.label': of('to'),
            },
          },
          {
            key: 'workShift',
            type: 'toggle',
            templateOptions: { textfieldLabelOutside: true, size: 'm' },
            defaultValue: false,
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
        'templateOptions.label': of('Friday'),
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
              'templateOptions.label': of('to'),
            },
          },
          {
            key: 'workShift',
            type: 'toggle',
            templateOptions: { textfieldLabelOutside: true, size: 'm' },
            defaultValue: false,
          },
        ],
      },
    },
  ];

  constructor(
    private cdr: ChangeDetectorRef,
    private workingTimesService: WorkingTimesService,
    private router: Router,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    private destroy$: TuiDestroyService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.configuration = { ...DefaultConfig };
    this.configuration.searchEnabled = true;

    this.columns = [
      { key: 'timeHoliday', title: 'Date' },
      { key: 'nameHoliday', title: 'Holiday' },
      { key: 'yearly', title: 'Repeat yearly' },
      { key: 'action', title: '' },
    ];

    combineLatest([this.page$, this.perPageSubject])
      .pipe(
        debounceTime(0),
        switchMap(([page, perpage]) => {
          return this.workingTimesService.getBranchDatas(page - 1, perpage);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((item) => {
        console.log('item'+item);
        this.totalLength = item.totalElements;
        this.cdr.detectChanges();
      });
    this.cdr.detectChanges();
  }

  saveSettings() {
    const formModel = this.form.value;
    const items = [
      {
        weekDayId: 1,
        values: [],
      },
      {
        weekDayId: 7,
        values: [],
      },
    ];

    const dayTime = [
      formModel.mondayTime,
      formModel.tuesdayTime,
      formModel.wednesdayTime,
      formModel.thursdayTime,
      formModel.fridayTime,
    ];
    const dayKey = [formModel.day2, formModel.day3, formModel.day4, formModel.day5, formModel.day6];
    for (let i = 2; i < 7; i++) {
      const m: number = i - 2;
      if (dayKey[m] == true) {
        items.push({
          weekDayId: i,
          values: dayTime[m],
        });
      }
    }

    this.settingsElement = {
      id: 'eaf06d90-207c-4642-a792-c378d48e4cc1',
      checkInAfter: formModel.checkInAfter,
      checkOutBefore: formModel.checkOutBefore,
      workingHour: formModel.workingHour,
      totalWorkingHour: formModel.totalWorkingHour,
      lunchHours: formModel.lunchHours,
      fingerPrint: formModel.fingerPrint,
      timePayroll: formModel.timePayroll,
      timePaidLeave: formModel.timePaidLeave,
      items: items,
    };
    // console.log(JSON.stringify(this.settingsElement));
    this.workingTimesService
      .saveSettings(this.settingsElement)
      .pipe(
        mapTo({ icon: 'success', text: 'Update Settings Successfully!' } as SweetAlertOptions),
        takeUntil(this.destroy$),
        catchError((err) =>
          of({
            icon: 'error',
            text: err.error.message,
            showCancelButton: true,
            showConfirmButton: false,
          } as SweetAlertOptions)
        ),
        switchMap((options) => this.prompt.open(options)),
        filter((result) => result.isConfirmed),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.router.navigate(['../..'], { relativeTo: this.activatedRoute }));
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
      yearly: this.holidayForm.controls['repeatYearly'].value,
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

  onPage(page: number) {
    this.page$.next(page + 1);
  }

  onSize(size: number) {
    this.perPageSubject.next(size);
  }
}
