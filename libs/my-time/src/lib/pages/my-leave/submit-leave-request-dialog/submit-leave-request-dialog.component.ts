import { ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { BaseOption } from '@nexthcm/ui';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT, PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { PartialDaysEnum } from '../../../enums/partial-days';
import { LeaveSubmit } from '../../../models/submit-leave';
import { MyLeaveService } from '../../../services/my-leave/my-leave.service';
import { SubmitLeaveService } from '../../../services/submit-leave.service';
import { DurationConfirmDialogComponent } from '../duaration-comfirm-dialog/duration-confirm-dialog.component';

@Component({
  selector: 'hcm-submit-leave-request-dialog',
  templateUrl: './submit-leave-request-dialog.component.html',
  styleUrls: ['./submit-leave-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitLeaveRequestDialogComponent {
  partialDays$: Observable<any[]> = this.myLeaveService.getPartialDays().pipe(map((data) => data));
  durationValues: Observable<any[]> = this.myLeaveService.getdurationValues().pipe(map((data) => data));
  timeValues$: Observable<any[]> = this.myLeaveService.getTimeValues().pipe(map((data) => data));
  halfTimeValues$: Observable<any[]> = this.myLeaveService.getHalfTime().pipe(map((data) => data));

  form = this.fb.group<LeaveSubmit>({});
  model: LeaveSubmit = {};
  fields: FormlyFieldConfig[] = [
    {
      className: 'col-span-full',
      key: 'leaveTypes',
      type: 'filter',
      templateOptions: {
        options: this.myLeaveService.select('leaveTypes'),
        labelProp: 'name',
        size: 's',
        single: true,
        required: true,
      },
    },

    {
      className: 'col-span-full',
      template: `
        <div class="my-8">
        <div style="border: 1px solid #e4e4e4"></div>
        </div>
        <h3 class="text-xl font-semibold">Paid Leave</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna
        fringilla urna, porttitor</p>
        </div>
        `,
    },

    {
      key: 'startTime',
      type: 'input-date',
      templateOptions: {
        label: 'From Date',
        placeholder: 'From Date',
        required: true,
        textfieldLabelOutside: true,
      },
    },

    {
      key: 'endTime',
      type: 'input-date',
      templateOptions: {
        label: 'To Date',
        placeholder: 'To Date',
        required: true,
        textfieldLabelOutside: true,
      },
    },

    {
      key: 'partialDays',
      type: 'select',
      templateOptions: {
        options: [
          {
            value: PartialDaysEnum.None,
            label: 'None',
          },
          {
            value: PartialDaysEnum.AllDays,
            label: 'All Days',
          },
          {
            value: PartialDaysEnum.StartDayOnly,
            label: 'Start Day Only',
          },
          {
            value: PartialDaysEnum.EndDayOnly,
            label: 'End Day Only',
          },
          {
            value: PartialDaysEnum.StartEndDay,
            label: 'Start End Day',
          },
        ],
        label: 'Partial Days All',
      },
      hideExpression: '!(model.startTime?.toLocalNativeDate() < model.endTime?.toLocalNativeDate())',
      expressionProperties: {
        className:
          '!(model.startTime?.toLocalNativeDate() < model.endTime?.toLocalNativeDate())  ?  "hidden" : "col-span-full"',
      },
    },

    {
      key: 'durationHold',
      type: 'select',
      templateOptions: {
        options: [],
        placeholder: 'Duration Start',
        label: 'Duration Start',
        required: true,
      },
      hideExpression: 'model.partialDays === 0',
      expressionProperties: {
        className: 'model.partialDays === 0  ?  "hidden" : ""',
        'templateOptions.disabled': '!model.startTime || !model.endTime',
      },
      hooks: {
        onInit: (field) => {
          const options: { [p: number]: BaseOption<number>[] } = {
            1: [
              { value: 1, label: 'Half Day' },
              { value: 2, label: 'Special Time' },
            ],
            2: [
              { value: 1, label: 'Half Day' },
              { value: 2, label: 'Special Time' },
            ],
            3: [
              { value: 1, label: 'Half Day' },
              { value: 2, label: 'Special Time' },
            ],
            4: [
              { value: 1, label: 'Half Day' },
              { value: 2, label: 'Special Time' },
            ],
          };
          const defaultOption: BaseOption<number>[] = [
            { value: 0, label: 'Full Day' },
            { value: 1, label: 'Half Day' },
            { value: 2, label: 'Special Time' },
          ];

          field!.templateOptions!.options = this.form.valueChanges.pipe(
            map((formValue) => formValue.partialDays),
            distinctUntilChanged(),
            map((value) => (value ? options[value] : defaultOption)),
            tap(() => field?.formControl?.setValue(null, { emitEvent: false }))
          );
        },
      },
    },

    {
      key: 'morning',
      type: 'select',
      templateOptions: {
        label: 'Half Day',
        textfieldLabelOutside: true,
        options: this.halfTimeValues$,
        placeholder: 'Morning or Afternoon',
      },
      hideExpression: 'model.durationHold !== 1',
      expressionProperties: {
        className: 'model.durationHold !== 1  ?  "hidden" : ""',
      },
    },

    {
      fieldGroupClassName: 'col-start-1 col-end-3',
      fieldGroup: [
        {
          key: 'specialTimeFrom',
          type: 'select',
          templateOptions: {
            options: this.timeValues$,
            labelProp: 'label',
            valueProp: 'time',
            placeholder: 'Special time from',
            label: 'Special time from',
          },
          hideExpression: 'model.durationHold !== 2',
          expressionProperties: {
            className: 'model.durationHold !== 2  ?  "hidden" : ""',
          },
        },
        {
          key: 'specialTimeTo',
          type: 'select',
          templateOptions: {
            options: this.timeValues$,
            labelProp: 'label',
            valueProp: 'time',
            placeholder: 'Special time to',
            label: 'Special time to',
          },
          hideExpression: 'model.durationHold !== 2',
          expressionProperties: {
            className: 'model.durationHold !== 2  ?  "hidden" : ""',
          },
        },
      ],
    },

    {
      key: 'durationEnd',
      type: 'select',
      templateOptions: {
        options: [],
        placeholder: 'Duration End',
        label: 'Duration End',
      },
      hideExpression:
        ' (model.partialDays !== 4 || !(model.startTime?.toLocalNativeDate() < model.endTime?.toLocalNativeDate()))',
      expressionProperties: {
        className:
          ' (model.partialDays !== 4 || !(model.startTime?.toLocalNativeDate() < model.endTime?.toLocalNativeDate()))  ?  "hidden" : ""',
      },
      hooks: {
        onInit: (field) => {
          const options: { [p: number]: BaseOption<number>[] } = {
            1: [
              { value: 1, label: 'Half Day' },
              { value: 2, label: 'Special Time' },
            ],
            2: [
              { value: 1, label: 'Half Day' },
              { value: 2, label: 'Special Time' },
            ],
            3: [
              { value: 1, label: 'Half Day' },
              { value: 2, label: 'Special Time' },
            ],
            4: [
              { value: 1, label: 'Half Day' },
              { value: 2, label: 'Special Time' },
            ],
          };
          const defaultOption: BaseOption<number>[] = [
            { value: 0, label: 'Full Day' },
            { value: 1, label: 'Half Day' },
            { value: 2, label: 'Special Time' },
          ];
          field!.templateOptions!.options = this.form.valueChanges.pipe(
            map((formValue) => formValue.partialDays),
            distinctUntilChanged(),
            map((value) => (value ? options[value] : defaultOption)),
            tap(() => field?.formControl?.setValue(null, { emitEvent: false }))
          );
        },
      },
    },

    {
      key: 'morning2',
      type: 'select',
      templateOptions: {
        options: this.halfTimeValues$,
        // labelProp: 'name',
        // valueProp: 'id',
        placeholder: 'Morning or Afternoon 2',
        label: 'Half Day 2',
      },
      hideExpression: 'model.durationEnd !== 1',
      expressionProperties: {
        className: 'model.durationEnd !== 1  ?  "hidden" : ""',
      },
    },

    {
      fieldGroupClassName: 'grid grid-cols-2 gap-4',
      fieldGroup: [
        {
          key: 'specialTimeFrom2',
          type: 'select',
          templateOptions: {
            options: this.timeValues$,
            labelProp: 'label',
            valueProp: 'time',
            placeholder: 'Special time from2',
            label: 'Special time from 2',
          },
          hideExpression: 'model.durationEnd !== 2 || model.partialDays !== 4',
          expressionProperties: {
            className: 'model.durationEnd !== 2 || model.partialDays !== 4 ?  "hidden" : ""',
          },
        },
        {
          key: 'specialTimeTo2',
          type: 'select',
          templateOptions: {
            options: this.timeValues$,
            labelProp: 'label',
            valueProp: 'time',
            placeholder: 'Special time to2',
            label: 'Special time to 2',
          },
          hideExpression: 'model.durationEnd !== 2 || model.partialDays !== 4',
          expressionProperties: {
            className: 'model.durationEnd !== 2 || model.partialDays !== 4 ?  "hidden" : ""',
          },
        },
      ],
    },

    {
      key: 'sendTo',
      type: 'select',
      templateOptions: {
        options: this.myLeaveService.select('sendToUsers'),
        labelProp: 'username',
        valueProp: 'id',
        placeholder: 'Send to',
        label: 'Send to',
        textfieldLabelOutside: true,
      },
    },

    {
      className: 'col-span-full',
      key: 'comments',
      type: 'text-area',
      templateOptions: {
        textfieldSize: 'l',
        expandable: false,
        rows: 4,
      },
    },
  ];

  // leaveRequestModel = this.form.value;
  // minusHours: number = this.leaveRequestModel.specialTimeTo?.hours - this.leaveRequestModel.specialTimeFrom?.hours;
  // minusMinutes: number = this.leaveRequestModel.specialTimeTo?.minutes - this.leaveRequestModel.specialTimeFrom?.minutes;
  // dayMinus: any = TuiDay.lengthBetween(this.leaveRequestModel.startTime, this.leaveRequestModel.endTime);

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<unknown, LeaveSubmit>,
    private submitLeaveService: SubmitLeaveService,
    private dialogService: TuiDialogService,
    private myLeaveService: MyLeaveService,
    private injector: Injector,
    private router: Router,
    private fb: FormBuilder
  ) {}

  submit() {
    // if (this.form.valid) {
    //   const leaveRequestModel = this.form.value;
    //
    //   if (leaveRequestModel.startTime.length === undefined) {
    //     if (leaveRequestModel.startTime.hours) {
    //       console.log('Tuidayy');
    //     }
    //   } else {
    //     if (leaveRequestModel.startTime.length > 10) {
    //       leaveRequestModel.startTime = format(
    //         (leaveRequestModel.startTime as TuiDay).toLocalNativeDate(),
    //         'yyyy-MM-dd'
    //       );
    //       leaveRequestModel.endTime = format((leaveRequestModel.endTime as TuiDay).toLocalNativeDate(), 'yyyy-MM-dd');
    //       leaveRequestModel.startTime = TuiDay.jsonParse(leaveRequestModel.startTime.substr(0, 10));
    //       leaveRequestModel.endTime = TuiDay.jsonParse(leaveRequestModel.endTime.substr(0, 10));
    //     } else if (leaveRequestModel.startTime.length <= 10) {
    //       leaveRequestModel.startTime = format(
    //         (leaveRequestModel.startTime as TuiDay).toLocalNativeDate(),
    //         'yyyy-MM-dd'
    //       );
    //       leaveRequestModel.endTime = format((leaveRequestModel.endTime as TuiDay).toLocalNativeDate(), 'yyyy-MM-dd');
    //       leaveRequestModel.startTime = TuiDay.jsonParse(leaveRequestModel.startTime);
    //       leaveRequestModel.endTime = TuiDay.jsonParse(leaveRequestModel.endTime);
    //     }
    //   }
    //
    //   let dayMinus = TuiDay.lengthBetween(leaveRequestModel.startTime, leaveRequestModel.endTime);
    //
    //   const minusHours: number = leaveRequestModel.specialTimeTo?.hours - leaveRequestModel.specialTimeFrom?.hours;
    //   const minusMinutes: number =
    //     leaveRequestModel.specialTimeTo?.minutes - leaveRequestModel.specialTimeFrom?.minutes;
    //
    //   if (dayMinus >= 1) {
    //     if (leaveRequestModel.partialDays === 0) {
    //     }
    //     //All day
    //     else if (leaveRequestModel.partialDays === 1) {
    //       //Half day
    //       if (leaveRequestModel.durationHold === 1) {
    //         if (leaveRequestModel.morning === 0) {
    //           dayMinus = this.convertDay(
    //             leaveRequestModel,
    //             leaveRequestModel.startTime,
    //             leaveRequestModel.endTime,
    //             'special-allday-half-morning'
    //           );
    //         } else if (leaveRequestModel.morning === 1) {
    //           dayMinus = this.convertDay(
    //             leaveRequestModel,
    //             leaveRequestModel.startTime,
    //             leaveRequestModel.endTime,
    //             'special-allday-half-afternoon'
    //           );
    //         }
    //       }
    //       //Special time
    //       else if (leaveRequestModel.durationHold === 2) {
    //         dayMinus = this.convertDay(
    //           leaveRequestModel,
    //           leaveRequestModel.startTime,
    //           leaveRequestModel.endTime,
    //           'special-allday-full'
    //         );
    //       }
    //     }
    //     //Start day only -00000
    //     else if (leaveRequestModel.partialDays === 2) {
    //       //Half day
    //       if (leaveRequestModel.durationHold === 0) {
    //         if (leaveRequestModel.morning === 0) {
    //           dayMinus = this.convertDay(
    //             leaveRequestModel,
    //             leaveRequestModel.startTime,
    //             leaveRequestModel.endTime,
    //             'special-allday-half-morning'
    //           );
    //         } else if (leaveRequestModel.morning === 1) {
    //           dayMinus = this.convertDay(
    //             leaveRequestModel,
    //             leaveRequestModel.startTime,
    //             leaveRequestModel.endTime,
    //             'special-allday-half-afternoon'
    //           );
    //         }
    //       }
    //       //Special time
    //       else if (leaveRequestModel.durationHold === 1) {
    //         dayMinus = this.convertDay(
    //           leaveRequestModel,
    //           leaveRequestModel.startTime,
    //           leaveRequestModel.endTime,
    //           'special-allday-full'
    //         );
    //       }
    //     }
    //     //End day only
    //     else if (leaveRequestModel.partialDays === 3) {
    //       //Half day
    //       if (leaveRequestModel.durationHold === 0) {
    //         if (leaveRequestModel.morning === 0) {
    //           dayMinus = this.convertDay(
    //             leaveRequestModel,
    //             leaveRequestModel.startTime,
    //             leaveRequestModel.endTime,
    //             'special-allday-half-morning'
    //           );
    //         } else if (leaveRequestModel.morning === 1) {
    //           dayMinus = this.convertDay(
    //             leaveRequestModel,
    //             leaveRequestModel.startTime,
    //             leaveRequestModel.endTime,
    //             'special-allday-half-afternoon'
    //           );
    //         }
    //       }
    //       //Special time
    //       else if (leaveRequestModel.durationHold === 1) {
    //         dayMinus = this.convertDay(
    //           leaveRequestModel,
    //           leaveRequestModel.startTime,
    //           leaveRequestModel.endTime,
    //           'special-allday-full'
    //         );
    //       }
    //     } else if (leaveRequestModel.partialDays === 4) {
    //       //Half day -0000000000
    //       dayMinus = this.convertDay(
    //         leaveRequestModel,
    //         leaveRequestModel.startTime,
    //         leaveRequestModel.endTime,
    //         'special-moreday'
    //       );
    //     }
    //   } else {
    //     if (leaveRequestModel.partialDays === 0) {
    //       //full day
    //       dayMinus = this.convertDay(leaveRequestModel, leaveRequestModel.startTime, leaveRequestModel.endTime, 'full');
    //     } else if (leaveRequestModel.partialDays === 1) {
    //       if (leaveRequestModel.morning === 0) {
    //         //Off morning
    //         dayMinus = this.convertDay(
    //           leaveRequestModel,
    //           leaveRequestModel.startTime,
    //           leaveRequestModel.endTime,
    //           'half-morning'
    //         );
    //       } else if (leaveRequestModel.morning === 1) {
    //         //Off afternoon
    //         dayMinus = this.convertDay(
    //           leaveRequestModel,
    //           leaveRequestModel.startTime,
    //           leaveRequestModel.endTime,
    //           'half-afternoon'
    //         );
    //       }
    //     } else if (leaveRequestModel.partialDays === 2) {
    //       //Special time one day
    //       dayMinus = this.convertDay(
    //         leaveRequestModel,
    //         leaveRequestModel.startTime,
    //         leaveRequestModel.endTime,
    //         'special-inday'
    //       );
    //     }
    //   }
    //
    //   const body = {
    //     leaveType: leaveRequestModel.leaveTypes[0],
    //     comments: leaveRequestModel.comments,
    //     sendTo: leaveRequestModel.sendTo,
    //     fromDate1: [leaveRequestModel.startTime],
    //     toDate1: [leaveRequestModel.endTime],
    //     duration1: [dayMinus],
    //   };
    //   console.log('body postttttt', body);
    //   this.showDialogConfirmDuration(dayMinus, body);
    // }
  }

  // convertDay(leaveRequestModel: any, startTime: TuiDay, endTime: TuiDay, type: string): number {
  //   // leaveRequestModel.startTime = format((leaveRequestModel.startTime as TuiDay).toLocalNativeDate(), 'yyyy-MM-dd');
  //   // leaveRequestModel.endTime = format((leaveRequestModel.endTime as TuiDay).toLocalNativeDate(), 'yyyy-MM-dd');
  //
  //   if (leaveRequestModel.startTime.length === undefined) {
  //     if (leaveRequestModel.startTime.hours) {
  //       console.log('Tuidayy Convert Day');
  //     }
  //   } else {
  //     if (leaveRequestModel.startTime.length > 10) {
  //       // leaveRequestModel.startTime = format((leaveRequestModel.startTime as TuiDay).toLocalNativeDate(), 'yyyy-MM-dd');
  //       // leaveRequestModel.endTime = format((leaveRequestModel.endTime as TuiDay).toLocalNativeDate(), 'yyyy-MM-dd');
  //       leaveRequestModel.startTime = TuiDay.jsonParse(leaveRequestModel.startTime.substr(0, 10));
  //       leaveRequestModel.endTime = TuiDay.jsonParse(leaveRequestModel.endTime.substr(0, 10));
  //     } else if (leaveRequestModel.startTime.length <= 10) {
  //       leaveRequestModel.startTime = TuiDay.jsonParse(leaveRequestModel.startTime);
  //       leaveRequestModel.endTime = TuiDay.jsonParse(leaveRequestModel.endTime);
  //     }
  //   }
  //
  //   const dayMinus: any = TuiDay.lengthBetween(leaveRequestModel.startTime, leaveRequestModel.endTime);
  //
  //   if (type === 'full') {
  //     leaveRequestModel.startTime = leaveRequestModel.startTime + ' ' + '08:30:00';
  //     leaveRequestModel.endTime = leaveRequestModel.endTime + ' ' + '17:30:00';
  //     return 1.0;
  //   } else if (type === 'half-morning') {
  //     leaveRequestModel.startTime = leaveRequestModel.startTime + ' ' + '08:30:00';
  //     leaveRequestModel.endTime = leaveRequestModel.endTime + ' ' + '12:00:00';
  //     return 0.5;
  //   } else if (type === 'half-afternoon') {
  //     leaveRequestModel.startTime = leaveRequestModel.startTime + ' ' + '13:00:00';
  //     leaveRequestModel.endTime = leaveRequestModel.endTime + ' ' + '17:30:00';
  //     return 0.5;
  //   } else if (type === 'special-inday') {
  //     const minusHours: number = leaveRequestModel.specialTimeTo?.hours - leaveRequestModel.specialTimeFrom?.hours;
  //     let minusMinutes: number = leaveRequestModel.specialTimeTo?.minutes - leaveRequestModel.specialTimeFrom?.minutes;
  //
  //     leaveRequestModel.startTime = format((leaveRequestModel.startTime as TuiDay).toLocalNativeDate(), 'yyyy-MM-dd');
  //     leaveRequestModel.endTime = format((leaveRequestModel.endTime as TuiDay).toLocalNativeDate(), 'yyyy-MM-dd');
  //
  //     const convertTimeFrom = leaveRequestModel.specialTimeFrom;
  //     leaveRequestModel.startTime = leaveRequestModel.startTime + ' ' + convertTimeFrom + ':00';
  //
  //     const convertTimeTo = leaveRequestModel.specialTimeTo;
  //     leaveRequestModel.endTime = leaveRequestModel.endTime + ' ' + convertTimeTo + ':00';
  //
  //     if (minusMinutes < 0) {
  //       minusMinutes = minusMinutes * -1;
  //     }
  //     return (minusHours + minusMinutes / 60) / 8;
  //   } else if (type === 'special-moreday') {
  //     let dayMinus: any = TuiDay.lengthBetween(leaveRequestModel.startTime, leaveRequestModel.endTime);
  //
  //     const minusHours: number = leaveRequestModel.specialTimeTo?.hours - leaveRequestModel.specialTimeFrom?.hours;
  //     let minusMinutes: number = leaveRequestModel.specialTimeTo?.minutes - leaveRequestModel.specialTimeFrom?.minutes;
  //
  //     const minusHours2: number = leaveRequestModel.specialTimeTo2?.hours - leaveRequestModel.specialTimeFrom2?.hours;
  //     let minusMinutes2: number =
  //       leaveRequestModel.specialTimeTo2?.minutes - leaveRequestModel.specialTimeFrom2?.minutes;
  //
  //     leaveRequestModel.startTime = format((leaveRequestModel.startTime as TuiDay).toLocalNativeDate(), 'yyyy-MM-dd');
  //     leaveRequestModel.endTime = format((leaveRequestModel.endTime as TuiDay).toLocalNativeDate(), 'yyyy-MM-dd');
  //
  //     const convertTimeFrom = leaveRequestModel.specialTimeFrom;
  //     leaveRequestModel.startTime = leaveRequestModel.startTime + ' ' + convertTimeFrom + ':00';
  //
  //     const convertTimeTo = leaveRequestModel.specialTimeTo;
  //     leaveRequestModel.endTime = leaveRequestModel.endTime + ' ' + convertTimeTo + ':00';
  //
  //     const convertTimeFrom2 = leaveRequestModel.specialTimeFrom2;
  //     leaveRequestModel.startTime = leaveRequestModel.startTime + ' ' + convertTimeFrom2 + ':00';
  //
  //     const convertTimeTo2 = leaveRequestModel.specialTimeTo2;
  //     leaveRequestModel.endTime = leaveRequestModel.endTime + ' ' + convertTimeTo2 + ':00';
  //
  //     if (minusMinutes < 0) {
  //       minusMinutes = minusMinutes * -1;
  //     }
  //     if (minusMinutes2 < 0) {
  //       minusMinutes2 = minusMinutes2 * -1;
  //     }
  //     if (dayMinus < 0) {
  //       dayMinus = dayMinus * -1;
  //     }
  //     return (minusHours + minusMinutes / 60) / 8 + (minusHours2 + minusMinutes2 / 60) / 8 + dayMinus;
  //   } else if (type === 'special-allday-half-morning') {
  //     const dayMinus: any = TuiDay.lengthBetween(leaveRequestModel.startTime, leaveRequestModel.endTime);
  //     leaveRequestModel.startTime = leaveRequestModel.startTime + ' ' + '08:30:00';
  //     leaveRequestModel.endTime = leaveRequestModel.endTime + ' ' + '12:00:00';
  //     return dayMinus / 2;
  //   } else if (type === 'special-allday-half-afternoon') {
  //     const dayMinus: any = TuiDay.lengthBetween(leaveRequestModel.startTime, leaveRequestModel.endTime);
  //     leaveRequestModel.startTime = leaveRequestModel.startTime + ' ' + '13:00:00';
  //     leaveRequestModel.endTime = leaveRequestModel.endTime + ' ' + '17:30:00';
  //     return dayMinus / 2;
  //   } else if (type === 'special-allday-full') {
  //     const minusHours: number = leaveRequestModel.specialTimeTo?.hours - leaveRequestModel.specialTimeFrom?.hours;
  //     let minusMinutes: number = leaveRequestModel.specialTimeTo?.minutes - leaveRequestModel.specialTimeFrom?.minutes;
  //
  //     leaveRequestModel.startTime = format((leaveRequestModel.startTime as TuiDay).toLocalNativeDate(), 'yyyy-MM-dd');
  //     leaveRequestModel.endTime = format((leaveRequestModel.endTime as TuiDay).toLocalNativeDate(), 'yyyy-MM-dd');
  //
  //     const convertTimeFrom = leaveRequestModel.specialTimeFrom;
  //     leaveRequestModel.startTime = leaveRequestModel.startTime + ' ' + convertTimeFrom + ':00';
  //
  //     const convertTimeTo = leaveRequestModel.specialTimeTo;
  //     leaveRequestModel.endTime = leaveRequestModel.endTime + ' ' + convertTimeTo + ':00';
  //
  //     if (minusMinutes < 0) {
  //       minusMinutes = minusMinutes * -1;
  //     }
  //     return ((minusHours + minusMinutes / 60) / 8) * dayMinus;
  //   }
  //   return dayMinus;
  // }

  showDialogConfirmDuration(dayMinus: number, body: any): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(DurationConfirmDialogComponent, this.injector), {
        closeable: false,
        data: dayMinus,
        size: 's',
      })
      .subscribe((data) => {
        if (data) {
          console.log('dayMinusssssss', dayMinus);
          this.context.completeWith(body);
        }
      });
  }
}
