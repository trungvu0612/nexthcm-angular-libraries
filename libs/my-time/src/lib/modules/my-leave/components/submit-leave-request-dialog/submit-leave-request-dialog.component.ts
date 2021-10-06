import { ChangeDetectionStrategy, Component, Inject, Injector, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseOption, PromptService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDay, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext, TuiDialogService } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT, PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { endOfDay, getTime } from 'date-fns';
import { from, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  share,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { LeaveSubmit, SubmitLeavePayLoad } from '../../../../models';
import { MyLeaveService, MyTimeService } from '../../../../services';
import { DurationConfirmDialogComponent } from '../duaration-comfirm-dialog/duration-confirm-dialog.component';

@Component({
  selector: 'hcm-submit-leave-request-dialog',
  templateUrl: './submit-leave-request-dialog.component.html',
  styleUrls: ['./submit-leave-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
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
        label: 'dateRange',
        placeholder: 'chooseDateRange',
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
            translate: true,
            labelClassName: 'font-semibold',
            placeholder: 'searchUsers',
            label: 'sendTo',
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
            textfieldLabelOutside: true,
            required: true,
          },
        },
      ],
    },
  ];
  readonly submit$ = new Subject<SubmitLeavePayLoad>();
  readonly submitHandler$ = this.submit$.pipe(
    switchMap((payload) =>
      this.myTimeService.submitLeaveRequest(payload).pipe(
        switchMap(() =>
          from(
            this.promptService.open({
              icon: 'success',
              html: this.translocoService.translate('myTime.submitRequestSuccessfully'),
            })
          )
        ),
        tap(() => this.context.completeWith(true)),
        catchError((err) =>
          from(
            this.promptService.open({
              icon: 'error',
              html: this.myTimeService.generateSubmittingLeaveRequestErrorMessage(err.error),
            })
          )
        ),
        startWith(null)
      )
    ),
    share(),
    takeUntil(this.destroy$)
  );
  readonly submitLoading$ = this.submitHandler$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean>,
    private readonly dialogService: TuiDialogService,
    private readonly myLeaveService: MyLeaveService,
    private readonly injector: Injector,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly myTimeService: MyTimeService,
    private readonly translocoService: TranslocoService
  ) {}

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
}
