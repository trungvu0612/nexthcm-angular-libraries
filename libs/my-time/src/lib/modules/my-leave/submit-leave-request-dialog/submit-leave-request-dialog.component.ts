import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { BaseOption } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDay } from '@taiga-ui/cdk';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT, PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { endOfDay, getTime } from 'date-fns';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { LeaveSubmit, PartialDayType, PayLoad } from '../../../models';
import { MyLeaveService } from '../../../services';
import { DurationConfirmDialogComponent } from '../duaration-comfirm-dialog/duration-confirm-dialog.component';

@Component({
  selector: 'hcm-submit-leave-request-dialog',
  templateUrl: './submit-leave-request-dialog.component.html',
  styleUrls: ['./submit-leave-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitLeaveRequestDialogComponent implements AfterViewInit {
  durationValues: Observable<any[]> = this.myLeaveService.getdurationValues().pipe(map((data) => data));
  timeValues$: Observable<any[]> = this.myLeaveService.getTimeValues().pipe(map((data) => data));
  halfTimeValues$: Observable<any[]> = this.myLeaveService.getHalfTime().pipe(map((data) => data));
  partialType$: Observable<PartialDayType[]> = this.myLeaveService.getPartialTypes().pipe(map((data) => data));

  descriptionLeaveType = '';
  titleLeaveType = '';
  partialType: any;
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
        labelProp1: 'remainingEntitlement',
        size: 's',
        single: true,
        required: true,
      },
    },

    {
      key: 'fromTo',
      type: 'input-date-range',
      templateOptions: {
        required: true,
        translate: true,
        label: 'Date range',
        labelClassName: 'font-semibold',
        placeholder: 'Choose dates',
      },
    },

    {
      fieldGroupClassName: 'grid grid-cols-1 gap-4 mt-4',
      fieldGroup: [
        {
          key: 'partialDays',
          type: 'select',
          templateOptions: {
            options: this.myLeaveService.select('partialDayTypes'),
            valueProp: '',
            labelProp: 'name',
            label: 'Partial Days All',
            size: 's',
            single: true,
            required: true,
          },
          hideExpression: 'model.fromTo?.isSingleDay',
          expressionProperties: {
            className: '!model.fromTo || model.fromTo.isSingleDay ? "hidden" : "col-span-full mt-4"',
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
          hideExpression: 'model.partialDays?.type === 0',
          expressionProperties: {
            className: 'model.partialDays?.type === 0  ?  "hidden" : ""',
            'templateOptions.disabled': '!model.fromTo',
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
                map((formValue) => formValue.partialDays?.type),
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
            valueProp: 'conVertToSecond',
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
            valueProp: 'conVertToSecond',
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
          hideExpression: 'model.partialDays?.type !== 4 ',
          expressionProperties: {
            className: 'model.partialDays?.type !== 4 ?  "hidden" : ""',
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
                map((formValue) => formValue.partialDays?.type),
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
          hideExpression: 'model.durationEnd !== 2 || model.partialDays?.type !== 4',
          expressionProperties: {
            className: 'model.durationEnd !== 2 || model.partialDays?.type !== 4 ?  "hidden" : ""',
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
          hideExpression: 'model.durationEnd !== 2 || model.partialDays?.type !== 4',
          expressionProperties: {
            className: 'model.durationEnd !== 2 || model.partialDays?.type !== 4 ?  "hidden" : ""',
          },
        },
      ],
    },

    {
      fieldGroupClassName: 'grid grid-cols-1 gap-4',
      fieldGroup: [
        {
          className: 'mt-4',
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

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<unknown, LeaveSubmit>,
    private dialogService: TuiDialogService,
    private myLeaveService: MyLeaveService,
    private injector: Injector,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.myLeaveService
      .getLeaveTypes()
      .pipe(map((data) => data[0]))
      .subscribe((data) => {
        this.form.controls.leaveTypes?.setValue([data], true);
      });
  }

  ngAfterViewInit(): void {}

  submit(): void {
    const leaveRequestModel = this.form.value;
    const body: PayLoad = {};

    body.fromDate = getTime((this.model.fromTo?.from as TuiDay).toLocalNativeDate());
    body.toDate = getTime(endOfDay((this.model.fromTo?.to as any).toLocalNativeDate()));

    body.items = this.myLeaveService.action(leaveRequestModel);
    if (this.model.leaveTypes) {
      body.leaveTypeId = this.model.leaveTypes[0]?.leaveTypeId;
    }
    body.comment = this.model.comments;
    body.sendTo = this.model.sendTo;
    body.partialDayTypeId = this.model.partialDays?.id;

    this.showDialogConfirmDuration(body);
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
          this.context.completeWith(resultDays);
        }
      });
  }
}
