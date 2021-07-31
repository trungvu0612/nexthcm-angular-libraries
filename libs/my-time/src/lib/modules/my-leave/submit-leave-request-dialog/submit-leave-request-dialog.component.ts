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
import { BodyTemp, DurationType, LeaveSubmit } from '../../../models/submit-leave';
import { MyLeaveService } from '../../../services/my-leave.service';
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
  model: LeaveSubmit = {
    comments: '',
    duration: undefined,
    durationHold: 0,
    endTime: undefined,
    halfDay: 0,
    leaveType: undefined,
    leaveTypes: [],
    partialDays: undefined,
    sendTo: '',
    specialTimeFrom: undefined,
    specialTimeTo: undefined,
    startTime: undefined,
    status: 0,
  };
  fields: FormlyFieldConfig[] = [

    {
      className: 'col-span-full mt-4',
      key: 'leaveTypes',
      type: 'filter',
      templateOptions: {
        options: this.myLeaveService.select('leaveTypeRemain'),
        labelProp: 'leaveTypeName',
        labelProp1: "remainingEntitlement",
        size: 's',
        single: true,
        required: true,
      },
    },

    {
      className: 'col-span-full mt-4',
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
      fieldGroupClassName: 'grid grid-cols-2 gap-4 mt-4',
      fieldGroup: [
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
      ],
    },

    {
      fieldGroupClassName: 'grid grid-cols-1 gap-4 mt-4',
      fieldGroup: [
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
            valueProp: 'value',
            label: 'Partial Days All',
          },
          hideExpression: '!(model.startTime?.toLocalNativeDate() < model.endTime?.toLocalNativeDate())',
          expressionProperties: {
            className:
              '!(model.startTime?.toLocalNativeDate() < model.endTime?.toLocalNativeDate())  ?  "hidden" : "col-span-full mt-4"',
          },
        },
      ],
    },

    {
      fieldGroupClassName: 'grid grid-cols-3 gap-4 mt-4',
      fieldGroup: [
        {
          key: 'durationHold',
          type: 'select',
          templateOptions: {
            options: [],
            placeholder: 'Duration Start',
            label: 'Duration Start',
            valueProp: 'value',
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
          key: 'halfDay',
          type: 'select',
          templateOptions: {
            label: 'Half Day',
            textfieldLabelOutside: true,
            options: this.halfTimeValues$,
            valueProp: 'value',
            placeholder: 'halfDay or Afternoon',
          },
          hideExpression: 'model.durationHold !== 1',
          expressionProperties: {
            className: 'model.durationHold !== 1  ?  "hidden" : "col-span-2"',
          },
        },
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
      fieldGroupClassName: 'grid grid-cols-3 gap-4 mt-4',
      fieldGroup: [
        {
          key: 'durationEnd',
          type: 'select',
          templateOptions: {
            options: [],
            valueProp: 'value',
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
          key: 'halfDay2',
          type: 'select',
          templateOptions: {
            options: this.halfTimeValues$,
            // labelProp: 'name',
            // valueProp: 'id',
            placeholder: 'halfDay or Afternoon 2',
            valueProp: 'value',
            label: 'Half Day 2',
          },
          hideExpression: 'model.durationEnd !== 1',
          expressionProperties: {
            className: 'model.durationEnd !== 1  ?  "hidden" : "col-span-2"',
          },
        },
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
      fieldGroupClassName: 'grid grid-cols-1 gap-4',
      fieldGroup: [
        // {
        //   className: 'mt-4',
        //   key: 'sendTo',
        //   type: 'select',
        //   templateOptions: {
        //     options: this.myLeaveService.select('sendToUsers'),
        //     labelProp: 'username',
        //     valueProp: 'id',
        //     placeholder: 'Send to',
        //     label: 'Send to',
        //     textfieldLabelOutside: true,
        //   },
        // },

        {
          className: 'mt-4',
          key: 'comments',
          type: 'text-area',
          templateOptions: {
            textfieldSize: 'l',
            expandable: false,
            rows: 4,
            textfieldLabelOutside: true,
            label: 'Comments',
          },
        },
      ],
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
    const leaveRequestModel = this.form.value;

    if (leaveRequestModel.specialTimeTo) {
      // console.log('milisecondddd', leaveRequestModel.startTime.toLocalNativeDate().getTime())
      console.log('milisecondddd', leaveRequestModel.specialTimeTo.toAbsoluteMilliseconds());
    } else {
      console.log('undefine');
    }

    const body: BodyTemp = {};
    const leaveItem: DurationType = { resultTime: 0 };
    const leaveItems: DurationType[] = [];

    if (leaveRequestModel) {
      if (leaveRequestModel.startTime && leaveRequestModel.endTime) {
        // if (TuiDay.lengthBetween(leaveRequestModel.startTime, leaveRequestModel.endTime) == 0) {
        //   body.leaveTypeId = '';
        //   body.fromDate = leaveRequestModel.startTime.toLocalNativeDate().getTime();
        //   body.toDate = leaveRequestModel.endTime.toLocalNativeDate().getTime();
        //   body.sendTo = '';
        //   body.comment = '';
        //   if (leaveRequestModel.durationHold != undefined && leaveRequestModel.partialDays == undefined) {
        //     leaveItem.durationTypeId = '';
        //     if (leaveRequestModel.durationHold == 0) {
        //       /*Full time*/
        //       leaveItem.fullDay = true;
        //       leaveItem.resultTime = 8.0;
        //     } else if (leaveRequestModel.durationHold == 1) {
        //       /*Half day*/
        //       if (leaveRequestModel.halfDay == 0) {
        //         leaveItem.morning = true;
        //         leaveItem.resultTime = 4.0;
        //         body.resultDays = leaveItem.resultTime;
        //       } else if (leaveRequestModel.halfDay == 1) {
        //         leaveItem.morning = false;
        //         leaveItem.resultTime = 4.0;
        //         body.resultDays = leaveItem.resultTime;
        //       }
        //     } else if (leaveRequestModel.durationHold == 2) {
        //       /*Special time*/
        //       if (leaveRequestModel.specialTimeFrom && leaveRequestModel.specialTimeTo) {
        //         leaveItem.fromTime = leaveRequestModel.specialTimeFrom.toAbsoluteMilliseconds();
        //         leaveItem.toTime = leaveRequestModel.specialTimeTo.toAbsoluteMilliseconds();
        //         leaveItem.resultTime = (leaveItem.toTime - leaveItem.fromTime) / 3600000;
        //         body.resultDays = leaveItem.resultTime;
        //       }
        //     }
        //     leaveItems.push(leaveItem);
        //     console.log('leaveItem[]]]]]]]', leaveItems);
        //     body.leaveItems = leaveItems;
        //     console.log('body', body);
        //   }
        // } else if (TuiDay.lengthBetween(leaveRequestModel.startTime, leaveRequestModel.endTime) > 0) {
        //   body.leaveTypeId = '';
        //   body.fromDate = leaveRequestModel.startTime.toLocalNativeDate().getTime();
        //   body.toDate = leaveRequestModel.endTime.toLocalNativeDate().getTime();
        //   body.sendTo = '';
        //   body.comment = '';
        //   if (leaveRequestModel.durationHold != undefined && leaveRequestModel.partialDays != undefined) {
        //     if (leaveRequestModel.partialDays == 0) {
        //       body.partialDayTypeId = '0';
        //       console.log('body', body);
        //       console.log('leaveItem', leaveItem);
        //     } else if (leaveRequestModel.partialDays == 1) {
        //       /*Khac ngay - all day - special day - time from - time to*/
        //       body.partialDayTypeId = '1';
        //       if (leaveRequestModel.durationHold == 1) {
        //         leaveItem.durationTypeId = '';
        //         if (leaveRequestModel.halfDay == 0) {
        //           leaveItem.morning = true;
        //           leaveItem.afternoon = false;
        //           leaveItem.resultTime = 4.0;
        //           body.resultDays = leaveItem.resultTime;
        //         } else if (leaveRequestModel.halfDay == 1) {
        //           leaveItem.morning = false;
        //           leaveItem.afternoon = true;
        //           leaveItem.resultTime = 4.0;
        //           body.resultDays = leaveItem.resultTime;
        //         }
        //       } else if (leaveRequestModel.durationHold == 2) {
        //         leaveItem.durationTypeId = '';
        //         if (leaveRequestModel.specialTimeFrom && leaveRequestModel.specialTimeTo) {
        //           leaveItem.fromTime = leaveRequestModel.specialTimeFrom.toAbsoluteMilliseconds();
        //           leaveItem.toTime = leaveRequestModel.specialTimeTo.toAbsoluteMilliseconds();
        //           leaveItem.resultTime = (leaveItem.toTime - leaveItem.fromTime) / 3600000;
        //           body.resultDays = leaveItem.resultTime;
        //         }
        //       }
        //       leaveItems.push(leaveItem);
        //       console.log('leaveItem[]]]]]]]', leaveItems);
        //       body.leaveItems = leaveItems;
        //       console.log('body', body);
        //     } else if (leaveRequestModel.partialDays == 2) {
        //       /*Khac ngay - start day only - special day - time from - time to*/
        //       body.partialDayTypeId = '2';
        //       if (leaveRequestModel.durationHold == 1) {
        //         leaveItem.durationTypeId = '';
        //         if (leaveRequestModel.halfDay == 0) {
        //           leaveItem.morning = true;
        //           leaveItem.afternoon = false;
        //           leaveItem.resultTime = 4.0;
        //           body.resultDays = leaveItem.resultTime;
        //         } else if (leaveRequestModel.halfDay == 1) {
        //           leaveItem.morning = false;
        //           leaveItem.afternoon = true;
        //           leaveItem.resultTime = 4.0;
        //           body.resultDays = leaveItem.resultTime;
        //         }
        //       } else if (leaveRequestModel.durationHold == 2) {
        //         leaveItem.durationTypeId = '';
        //         if (leaveRequestModel.specialTimeFrom && leaveRequestModel.specialTimeTo) {
        //           leaveItem.fromTime = leaveRequestModel.specialTimeFrom.toAbsoluteMilliseconds();
        //           leaveItem.toTime = leaveRequestModel.specialTimeTo.toAbsoluteMilliseconds();
        //           leaveItem.resultTime = (leaveItem.toTime - leaveItem.fromTime) / 3600000;
        //           body.resultDays = leaveItem.resultTime;
        //         }
        //       }
        //       leaveItems.push(leaveItem);
        //       console.log('leaveItem[]]]]]]]', leaveItems);
        //       body.leaveItems = leaveItems;
        //       console.log('body', body);
        //     } else if (leaveRequestModel.partialDays == 3) {
        //       /*Khac ngay - end day only - special day - time from - time to*/
        //       body.partialDayTypeId = '3';
        //       if (leaveRequestModel.durationHold == 1) {
        //         leaveItem.durationTypeId = '';
        //         if (leaveRequestModel.halfDay == 0) {
        //           leaveItem.morning = true;
        //           leaveItem.afternoon = false;
        //           leaveItem.resultTime = 4.0;
        //           body.resultDays = leaveItem.resultTime;
        //         } else if (leaveRequestModel.halfDay == 1) {
        //           leaveItem.morning = false;
        //           leaveItem.afternoon = true;
        //           leaveItem.resultTime = 4.0;
        //           body.resultDays = leaveItem.resultTime;
        //         }
        //       } else if (leaveRequestModel.durationHold == 2) {
        //         leaveItem.durationTypeId = '';
        //         if (leaveRequestModel.specialTimeFrom && leaveRequestModel.specialTimeTo) {
        //           leaveItem.fromTime = leaveRequestModel.specialTimeFrom.toAbsoluteMilliseconds();
        //           leaveItem.toTime = leaveRequestModel.specialTimeTo.toAbsoluteMilliseconds();
        //           leaveItem.resultTime = (leaveItem.toTime - leaveItem.fromTime) / 3600000;
        //           body.resultDays = leaveItem.resultTime;
        //         }
        //       }
        //       leaveItems.push(leaveItem);
        //       console.log('leaveItem[]]]]]]]', leaveItems);
        //       body.leaveItems = leaveItems;
        //       console.log('body', body);
        //     } else if (leaveRequestModel.partialDays == 4) {
        //       /*Khac ngay - start end day only - special day - time from - time to*/
        //       const leaveItem1: DurationType = { resultTime: 0 };
        //
        //       body.partialDayTypeId = '4';
        //       if (leaveRequestModel.durationHold == 1) {
        //         if (leaveRequestModel.halfDay == 0) {
        //           leaveItem1.durationTypeId = '';
        //           leaveItem1.morning = true;
        //           leaveItem1.afternoon = false;
        //           leaveItem1.resultTime = 4.0;
        //           body.resultDays = leaveItem.resultTime;
        //         } else if (leaveRequestModel.halfDay == 1) {
        //           leaveItem1.durationTypeId = '';
        //           leaveItem1.morning = false;
        //           leaveItem1.afternoon = true;
        //           leaveItem1.resultTime = 4.0;
        //           body.resultDays = leaveItem.resultTime;
        //         }
        //       } else if (leaveRequestModel.durationHold == 2) {
        //         if (leaveRequestModel.specialTimeFrom && leaveRequestModel.specialTimeTo) {
        //           leaveItem1.durationTypeId = '';
        //           leaveItem1.fromTime = leaveRequestModel.specialTimeFrom.toAbsoluteMilliseconds();
        //           leaveItem1.toTime = leaveRequestModel.specialTimeTo.toAbsoluteMilliseconds();
        //           leaveItem1.resultTime = (leaveItem1.toTime - leaveItem1.fromTime) / 3600000;
        //         }
        //       }
        //       if (Object.keys(leaveItem1).length !== 0) {
        //         leaveItems.push(leaveItem1);
        //       }
        //       /**/
        //       const leaveItem2: DurationType = { resultTime: 0 };
        //
        //       if (leaveRequestModel.durationEnd == 1) {
        //         if (leaveRequestModel.halfDay2 == 0) {
        //           leaveItem2.durationTypeId = '';
        //           leaveItem2.morning = true;
        //           leaveItem2.afternoon = false;
        //           leaveItem2.resultTime = 4.0;
        //           body.resultDays = leaveItem.resultTime;
        //         } else if (leaveRequestModel.halfDay2 == 1) {
        //           leaveItem2.durationTypeId = '';
        //           leaveItem2.morning = false;
        //           leaveItem2.afternoon = true;
        //           leaveItem2.resultTime = 4.0;
        //         }
        //       } else if (leaveRequestModel.durationEnd == 2) {
        //         if (leaveRequestModel.specialTimeFrom2 && leaveRequestModel.specialTimeTo2) {
        //           leaveItem2.durationTypeId = '';
        //           leaveItem2.fromTime = leaveRequestModel.specialTimeFrom2.toAbsoluteMilliseconds();
        //           leaveItem2.toTime = leaveRequestModel.specialTimeTo2.toAbsoluteMilliseconds();
        //           leaveItem2.resultTime = (leaveItem2.toTime - leaveItem2.fromTime) / 3600000;
        //         }
        //       }
        //       if (Object.keys(leaveItem2).length !== 0) {
        //         leaveItems.push(leaveItem2);
        //       }
        //       console.log('leaveItem[]]]]]]]', leaveItems);
        //       body.leaveItems = leaveItems;
        //
        //       if (leaveItems.length != 0) {
        //         if (leaveItems.length == 1) {
        //           body.resultDays = leaveItems[0].resultTime;
        //         } else if (leaveItems.length == 2) {
        //           if (leaveItems[1].resultTime && leaveItems[0].resultTime) {
        //             const minusDays = TuiDay.lengthBetween(leaveRequestModel.startTime, leaveRequestModel.endTime);
        //             const plusDays = leaveItems[0].resultTime + leaveItems[1].resultTime;
        //             const result = this.checkDays(minusDays, plusDays);
        //             if (minusDays == 1) {
        //               body.resultDays = result.plusDays;
        //             } else if (minusDays >= 2) {
        //               body.resultDays = result.minusDays - 1 + result.plusDays;
        //             }
        //           }
        //         }
        //       } else {
        //         console.log('Bang 0');
        //       }
        //       console.log('body', body);
        //     }
        //     console.log('Oke khac ngay');
        //   }
        // }
        body.partialDayTypeId = "1393df26-9970-4633-9465-8d9d6a9234c6";
        body.fromDate = leaveRequestModel.startTime.toLocalNativeDate().getTime();
        body.toDate = leaveRequestModel.endTime.toLocalNativeDate().getTime();
        if (this.model.leaveTypes){
          body.leaveTypeId = this.model.leaveTypes[0]?.leaveTypeId
        } else {
        }
        body.comment = this.model.comments
        this.showDialogConfirmDuration(body);
      }
    }
  }

  checkDays(minusDays: number, plusDays: number): any {
    const result = {
      minusDays: minusDays,
      plusDays: plusDays,
    };
    if (plusDays > 8) {
      minusDays++;
      plusDays = plusDays - 8;
    }
    result.minusDays = minusDays;
    result.plusDays = plusDays;
    return result;
  }

  showDialogConfirmDuration(resultDays: any): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(DurationConfirmDialogComponent, this.injector), {
        closeable: false,
        data: resultDays,
        size: 's',
      })
      .subscribe((data) => {
        if (data) {
          console.log('resultDaysssss', resultDays);
          this.context.completeWith(resultDays);
        }
      });
  }
}
