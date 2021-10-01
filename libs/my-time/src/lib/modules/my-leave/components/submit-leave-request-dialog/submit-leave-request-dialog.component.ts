import { ChangeDetectionStrategy, Component, Inject, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseOption, PromptService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDay, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT, PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { endOfDay, getTime } from 'date-fns';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { LeaveSubmit, SubmitLeavePayLoad } from '../../../../models';
import { MyLeaveService, MyTimeService } from '../../../../services';
import { DurationConfirmDialogComponent } from '../duaration-comfirm-dialog/duration-confirm-dialog.component';

@Component({
  selector: 'hcm-submit-leave-request-dialog',
  templateUrl: './submit-leave-request-dialog.component.html',
  styleUrls: ['./submit-leave-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class SubmitLeaveRequestDialogComponent implements OnInit {
  timeValues$: Observable<any[]> = this.myLeaveService.getTimeValues();
  halfTimeValues$: Observable<any[]> = this.myLeaveService.getHalfTime();

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
      className: 'tui-form__row block',
      key: 'leaveTypes',
      type: 'filter',
      templateOptions: {
        labelClassName: 'font-semibold',
        options: this.myLeaveService.select('leaveTypeRemain'),
        labelProp: 'leaveTypeName',
        labelPropEntitlement: 'remainingEntitlement',
        size: 'm',
        single: true,
        required: true,
      },
    },
    {
      className: 'tui-form__row block',
      key: 'fromTo',
      type: 'input-date-range',
      templateOptions: {
        textfieldLabelOutside: true,
        labelClassName: 'font-semibold',
        required: true,
        translate: true,
        label: 'Date range',
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
            labelClassName: 'font-semibold',
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
            labelClassName: 'font-semibold',
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
            labelClassName: 'font-semibold',
            valueProp: 'value',
            placeholder: 'halfDay or Afternoon',
            required: true,
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
            labelClassName: 'font-semibold',
            labelProp: 'label',
            valueProp: 'conVertToSecond',
            placeholder: 'Special time from',
            label: 'Special time from',
            required: true,
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
            labelClassName: 'font-semibold',
            labelProp: 'label',
            valueProp: 'conVertToSecond',
            placeholder: 'Special time to',
            label: 'Special time to',
            required: true,
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
            labelClassName: 'font-semibold',
            valueProp: 'value',
            placeholder: 'Duration End',
            label: 'Duration End',
            required: true,
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
            labelClassName: 'font-semibold',
            placeholder: 'halfDay or Afternoon 2',
            valueProp: 'value',
            label: 'Half Day 2',
            required: true,
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
            labelClassName: 'font-semibold',
            labelProp: 'label',
            valueProp: 'conVertToSecond',
            placeholder: 'Special time from2',
            label: 'Special time from 2',
            required: true,
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
            labelClassName: 'font-semibold',
            labelProp: 'label',
            valueProp: 'conVertToSecond',
            placeholder: 'Special time to2',
            label: 'Special time to 2',
            required: true,
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
          type: 'user-combo-box',
          templateOptions: {
            labelClassName: 'font-semibold',
            placeholder: 'Type to search',
            label: 'Send to',
            textfieldLabelOutside: true,
            labelProp: 'name',
            valueProp: 'id',
          },
        },

        {
          className: 'mt-4',
          key: 'comments',
          type: 'text-area',
          templateOptions: {
            translate: true,
            labelClassName: 'font-semibold',
            textfieldSize: 'l',
            expandable: false,
            rows: 4,
            label: 'Comment',
            required: true,
          },
        },
      ],
    },
  ];
  readonly submit$ = new Subject<SubmitLeavePayLoad>();
  readonly submitHandler$ = this.submit$.pipe(
    switchMap((payload) => this.myLeaveService.createLeave(payload).pipe(startWith(null)))
  );
  readonly submitLoading$ = this.submitHandler$.pipe(map((value) => !value));

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) public context: TuiDialogContext<boolean>,
    private dialogService: TuiDialogService,
    private myLeaveService: MyLeaveService,
    private injector: Injector,
    private router: Router,
    private fb: FormBuilder,
    private destroy$: TuiDestroyService,
    private promptService: PromptService,
    private myTimeService: MyTimeService,
    private readonly translocoService: TranslocoService,
    state: RxState<Record<string, unknown>>
  ) {
    state.hold(
      this.submitHandler$.pipe(
        filter(isPresent),
        tap(
          () =>
            this.promptService
              .open({
                icon: 'success',
                html: this.translocoService.translate('myTime.submitRequestSuccessfully'),
              })
              .then(() => this.context.completeWith(true)),
          (err) =>
            this.promptService.open({
              icon: 'error',
              html: this.errorSubmitLeave(err.error),
            })
        )
      )
    );
  }

  ngOnInit(): void {
    this.myLeaveService
      .getLeaveTypes()
      .pipe(
        map((data) => data[0]),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        this.form.controls.leaveTypes?.setValue([data], true);
      });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const leaveRequestModel = { ...this.form.value };
      const body = {} as SubmitLeavePayLoad;

      body.fromDate = getTime((this.model.fromTo?.from as TuiDay).toLocalNativeDate());
      body.toDate = getTime(endOfDay((this.model.fromTo?.to as TuiDay).toLocalNativeDate()));

      if (this.model.specialTimeFrom && this.model.specialTimeTo) {
        leaveRequestModel.specialTimeFrom = this.model.specialTimeFrom;
        leaveRequestModel.specialTimeTo = this.model.specialTimeTo;
      }

      if (this.model.specialTimeFrom2) {
        if (this.model.specialTimeTo2) {
          leaveRequestModel.specialTimeFrom2 = this.model.specialTimeFrom2;
          leaveRequestModel.specialTimeTo2 = this.model.specialTimeTo2;
        }
      }

      const checkItem = this.myLeaveService.action(leaveRequestModel);
      if (checkItem !== null) {
        body.items = checkItem;
      }
      if (this.model.leaveTypes) {
        body.leaveTypeId = this.model.leaveTypes[0]?.leaveTypeId;
      }
      body.comment = this.model.comments;
      body.sendTo = this.model.sendTo;
      body.partialDayTypeId = this.model.partialDays?.id;

      this.showDialogConfirmDuration(body);
    }
  }

  showDialogConfirmDuration(resultDays: SubmitLeavePayLoad): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(DurationConfirmDialogComponent, this.injector), {
        data: resultDays,
        size: 's',
      })
      .pipe(
        filter((result) => result),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.submit$.next(resultDays));
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }

  errorSubmitLeave(dataLeave: any) {
    let dataLeaveErr = dataLeave.message;
    if (dataLeave.message.includes('EXCEED_LEAVE')) {
      dataLeaveErr = `<span class="bold text-xl">Leave request is exceed ${dataLeave?.errorMetadata?.exceedEntitlement} days ${dataLeave?.errorMetadata?.leaveTypeName}!</span>`;
      dataLeaveErr += '<ul class="mt-3 text-base">';
      dataLeaveErr += `<li><p>Remain leave: ${dataLeave?.errorMetadata?.durationInDay} days</p></li>`;
      dataLeaveErr += '<li><p>Leave request: ' + dataLeave?.errorMetadata?.remainingEntitlement + ' days</p></li>';
      dataLeaveErr += '</ul>';
    }
    if (dataLeave.message.includes('LEAVE_IS_DUPLICATED_DURATION')) {
      dataLeaveErr = '<span class="bold text-xl">Leave is already existed at:</span>';
      dataLeaveErr += '<ul class="mt-3 text-base">';
      dataLeave?.errorMetadata?.leaveDuplicatedList.forEach(function (value: any) {
        dataLeaveErr +=
          '<li><strong>' +
          value.leaveTypeName +
          '</strong> from <strong>' +
          new Date(value.fromDate).toLocaleDateString('en-GB') +
          '</strong> to <strong>' +
          new Date(value.toDate).toLocaleDateString('en-GB') +
          '</strong></li>';
      });
      dataLeaveErr += '</ul>';
    }
    return dataLeaveErr;
  }
}
