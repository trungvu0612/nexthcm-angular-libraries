import { ChangeDetectionStrategy, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BaseOption } from '@nexthcm/ui';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDay } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { format } from 'date-fns';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { LeaveSubmit } from '../../../models/submit-leave';
import { MyLeaveService } from '../../../services/my-leave/my-leave.service';
import { SubmitLeaveService } from '../../../services/submit-leave.service';

@Component({
  selector: 'hcm-submit-leave-request-dialog',
  templateUrl: './submit-leave-request-dialog.component.html',
  styleUrls: ['./submit-leave-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitLeaveRequestDialogComponent implements OnInit {
  @Output() formValueEvent = new EventEmitter<string>();

  nameItemList: any[] = [];
  data$: Observable<any> = this.myLeaveService.getLeaveType().pipe(map((data) => data.items));
  dataDuration$: Observable<any> = this.myLeaveService.getdurations().pipe(map((data) => data.data.items));
  dataSendTo$: Observable<any> = this.myLeaveService.getSendTo().pipe(map((data) => data.data.items));

  durationHide = false;
  specialTimeHide = false;

  partialDays$: Observable<any[]> = this.myLeaveService.getPartialDays().pipe(map((data) => data));
  durationValues: Observable<any[]> = this.myLeaveService.getdurationValues().pipe(map((data) => data));
  timeValues$: Observable<any[]> = this.myLeaveService.getTimeValues().pipe(map((data) => data));
  halfTimeValues$: Observable<any[]> = this.myLeaveService.getHalfTime().pipe(map((data) => data));

  form = new FormGroup<LeaveSubmit | any>({});
  model: LeaveSubmit = {};
  fields: FormlyFieldConfig[] = [
    {
      className: 'col-span-full',
      key: 'leaveType',
      type: 'filter',
      templateOptions: {
        options: this.data$,
        labelProp: 'name',
        size: 's',
        single: true,
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
        description: 'From Date',
        required: true,
      },
    },

    {
      key: 'endTime',
      type: 'input-date',
      templateOptions: {
        label: 'To Date',
        placeholder: 'To Date',
        description: 'To Date',
        required: true,
      },
    },

    {
      key: 'partialDays',
      type: 'select',
      templateOptions: {
        options: this.partialDays$,
        placeholder: 'Partial Days All',
      },
      hideExpression: '!(model.startTime?.toLocalNativeDate() < model.endTime?.toLocalNativeDate())',
      expressionProperties: {
        className: '!(model.startTime?.toLocalNativeDate() < model.endTime?.toLocalNativeDate())  ?  "hidden" : ""',
      },
    },

    {
      key: 'durationHold',
      type: 'select',
      templateOptions: {
        options: [],
        placeholder: 'Duration Start',
      },
      hideExpression: 'model.partialDays === 0',
      expressionProperties: {
        className: 'model.partialDays === 0  ?  "hidden" : ""',
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
        options: this.halfTimeValues$,
        placeholder: 'Morning or Afternoon',
      },
      hideExpression: 'model.durationHold !== 1',
      expressionProperties: {
        className: 'model.durationHold !== 1  ?  "hidden" : ""',
      },
    },

    {
      key: 'specialTimeFrom',
      type: 'select',
      templateOptions: {
        options: this.timeValues$,
        labelProp: 'label',
        valueProp: 'label',
        placeholder: 'Special time from',
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
        valueProp: 'label',
        placeholder: 'Special time to',
      },
      hideExpression: 'model.durationHold !== 2',
      expressionProperties: {
        className: 'model.durationHold !== 2  ?  "hidden" : ""',
      },
    },

    // special duraton when click special time
    {
      key: 'durationEnd',
      type: 'select',
      templateOptions: {
        options: [],
        placeholder: 'Duration End',
      },
      // hideExpression: 'model.partialDays === 0',
      // expressionProperties: {
      //   className: 'model.partialDays === 0  ?  "hidden" : ""',
      // },
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
    //end

    {
      key: 'morning2',
      type: 'select',
      templateOptions: {
        options: this.halfTimeValues$,
        // labelProp: 'name',
        // valueProp: 'id',
        placeholder: 'Morning or Afternoon 2',
      },
      hideExpression: 'model.durationEnd !== 1',
      expressionProperties: {
        className: 'model.durationEnd !== 1  ?  "hidden" : ""',
      },
    },

    //Start day 1: half day, special day

    //
    {
      key: 'specialTimeFrom2',
      type: 'select',
      templateOptions: {
        options: this.timeValues$,
        placeholder: 'Special time from2',
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
        placeholder: 'Special time to2',
      },
      hideExpression: 'model.durationEnd !== 2 || model.partialDays !== 4',
      expressionProperties: {
        className: 'model.durationEnd !== 2 || model.partialDays !== 4 ?  "hidden" : ""',
      },
    },

    //
    // {
    //   key: 'duration',
    //   type: 'select',
    //   templateOptions: {
    //     options: this.dataDuration$,
    //     labelProp: 'name',
    //     valueProp: 'id',
    //     placeholder: 'Duration',
    //   },
    // },

    {
      key: 'sendTo',
      type: 'select',
      templateOptions: {
        options: this.dataSendTo$,
        labelProp: 'username',
        valueProp: 'id',
        placeholder: 'Send to',
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

  get check(): string {
    return this.model.startTime &&
      this.model.endTime &&
      this.model.startTime.toLocalNativeDate() < this.model.endTime.toLocalNativeDate()
      ? ''
      : 'hidden';
  }

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<unknown, LeaveSubmit>,
    private submitLeaveService: SubmitLeaveService,
    private myLeaveService: MyLeaveService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // this.form.valueChanges.subscribe((value) => console.log(this.model, this.form.value));
  }

  submit() {
    if (this.form.valid) {
      const leaveRequestModel = this.form.value;

      leaveRequestModel.startTime = format((leaveRequestModel.startTime as TuiDay).toLocalNativeDate(), 'yyyy-MM-dd');
      leaveRequestModel.endTime = format((leaveRequestModel.endTime as TuiDay).toLocalNativeDate(), 'yyyy-MM-dd');

      const converTimeFrom = leaveRequestModel.specialTimeFrom;
      leaveRequestModel.startTime = leaveRequestModel.startTime + ' ' + converTimeFrom.replace(/\s/g, '');

      const converTimeTo = leaveRequestModel.specialTimeTo;
      leaveRequestModel.startTime = leaveRequestModel.startTime + ' ' + converTimeTo.replace(/\s/g, '');

      leaveRequestModel.leaveType = leaveRequestModel.leaveType[0];

      const body = {
        leaveType: leaveRequestModel.leaveType,
        comments: leaveRequestModel.comments,
        sendTo: leaveRequestModel.sendTo,
        fromDate1: [leaveRequestModel.startTime],
        toDate1: [leaveRequestModel.startTime],
        duration1: [2.5],
      };
      this.context.completeWith(body);
      console.log('body postttttt', body);
    }
  }
}
