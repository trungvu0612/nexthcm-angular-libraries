import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, OnInit, ViewChild } from '@angular/core';
import { PromptService } from '@nexthcm/cdk';
import { BaseFormComponentModule } from '@nexthcm/ui';
import { FormBuilder, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoModule, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TuiDay, TuiDayRange, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT, PolymorpheusModule, PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';
import { endOfDay } from 'date-fns';
import { combineLatest, from, of, Subject } from 'rxjs';
import { catchError, map, share, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DurationType, PartialDays } from '../../internal/enums';
import {
  LeaveRequestForm,
  LeaveRequestPayload,
  PartialDaysType,
  RemainingLeaveEntitlement,
} from '../../internal/models';
import { MyLeaveService, MyTimeService } from '../../services';

@Component({
  selector: 'hcm-create-leave-request-dialog',
  templateUrl: './create-leave-request-dialog.component.html',
  styleUrls: ['./create-leave-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class CreateLeaveRequestDialogComponent implements OnInit {
  @ViewChild('partialDaysContent', { static: true }) partialDaysContent!: PolymorpheusTemplate<PartialDaysType>;

  readonly partialDaysTypeContext!: { $implicit: PartialDaysType };
  model = {} as LeaveRequestForm;
  form = this.fb.group<LeaveRequestForm>(this.model);
  options: FormlyFormOptions = {
    formState: {},
  };
  fields!: FormlyFieldConfig[];
  readonly submit$ = new Subject<LeaveRequestPayload>();
  readonly submitHandler$ = this.submit$.pipe(
    switchMap((payload) =>
      this.myLeaveService.submitLeaveRequest(payload).pipe(
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
    private readonly fb: FormBuilder,
    private readonly myLeaveService: MyLeaveService,
    private readonly myTimeService: MyTimeService,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, RemainingLeaveEntitlement[]>,
    private readonly translocoService: TranslocoService,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService
  ) {}

  ngOnInit(): void {
    this.fields = [
      {
        key: 'employeeId',
        className: 'tui-form__row block',
        type: 'user-combo-box',
        templateOptions: {
          translate: true,
          required: true,
          label: 'employee',
          labelClassName: 'font-semibold',
          placeholder: 'searchEmployees',
          valueProp: 'id',
        },
        hide: !!this.context.data,
      },
      {
        key: 'leaveType',
        className: 'tui-form__row block',
        type: 'filter',
        templateOptions: {
          required: true,
          options: this.context.data || [],
          labelProp: 'leaveTypeName',
          single: true,
          badgeHandler: (item: RemainingLeaveEntitlement) => item.remainingEntitlement.toString(),
          identityMatcher: (item1: RemainingLeaveEntitlement, item2: RemainingLeaveEntitlement) =>
            item1.leaveTypeId === item2.leaveTypeId,
          disabledItemHandler: (item: RemainingLeaveEntitlement) => item.remainingEntitlement <= 0,
        },
        validation: {
          messages: {
            required: () => this.translocoService.selectTranslate('leaveTypeRequired', {}, this.scope),
          },
        },
        hooks: {
          onInit: (field) => {
            if (field?.templateOptions) {
              field.templateOptions.options = this.form.controls.employeeId.valueChanges.pipe(
                switchMap((employeeId) =>
                  employeeId ? this.myLeaveService.getEmployeeLeaveEntitlements(employeeId) : of([])
                )
              );
            }
          },
        },
      },
      {
        key: 'fromTo',
        className: 'tui-form__row block',
        type: 'input-date-range',
        templateOptions: {
          translate: true,
          required: true,
          label: 'dateRange',
          labelClassName: 'font-semibold',
          placeholder: 'chooseDateRange',
          textfieldLabelOutside: true,
        },
      },
      {
        key: 'partialDays',
        className: 'tui-form__row block',
        type: 'select',
        templateOptions: {
          translate: true,
          label: 'partialDays',
          labelClassName: 'font-semibold',
          options: this.myLeaveService.select('partialDayTypes'),
          labelProp: 'name',
          translocoScope: this.scope,
          required: true,
          customContent: this.partialDaysContent,
        },
        hooks: {
          onInit: (field) => {
            field?.formControl?.valueChanges
              .pipe(takeUntil(this.destroy$))
              .subscribe((partialDays: PartialDaysType) => (this.options.formState.partialDays = partialDays.type));
          },
        },
        hideExpression: (model: LeaveRequestForm) => !model.fromTo || model.fromTo.isSingleDay,
      },
      {
        key: 'startDay',
        className: 'tui-form__row block',
        fieldGroupClassName: 'grid grid-cols-3 gap-x-4',
        fieldGroup: [
          {
            key: 'type',
            type: 'select',
            templateOptions: {
              options: [],
              labelClassName: 'font-semibold',
              valueProp: 'value',
              required: true,
            },
            defaultValue: DurationType.HalfDay,
            hooks: {
              onInit: (field) => {
                const fromToControl = (field?.parent?.form as FormGroup<LeaveRequestForm>)?.controls
                  ?.fromTo as FormControl<TuiDayRange>;

                if (fromToControl && field?.templateOptions) {
                  field.templateOptions.options = combineLatest([
                    this.translocoService.selectTranslateObject(
                      'LEAVE_DURATION_OPTIONS',
                      {},
                      (this.scope as ProviderScope).scope
                    ),
                    fromToControl.valueChanges.pipe(startWith(fromToControl.value)),
                  ]).pipe(
                    map(([result, fromTo]) =>
                      fromTo?.isSingleDay
                        ? [
                            { label: result.fullDay, value: DurationType.FullDay },
                            { label: result.halfDay, value: DurationType.HalfDay },
                            { label: result.specifyTime, value: DurationType.SpecifyTime },
                          ]
                        : [
                            { label: result.halfDay, value: DurationType.HalfDay },
                            { label: result.specifyTime, value: DurationType.SpecifyTime },
                          ]
                    )
                  );
                }
              },
            },
            expressionProperties: {
              'templateOptions.label': this.form.valueChanges.pipe(
                map((formModel) =>
                  formModel.fromTo?.isSingleDay || formModel.partialDays?.type === PartialDays.AllDays
                    ? 'duration'
                    : 'startDay'
                ),
                switchMap((key) => this.translocoService.selectTranslate(key, {}, this.scope))
              ),
            },
          },
          {
            key: 'value',
            type: 'select',
            templateOptions: {
              required: true,
              valueProp: 'value',
              options: this.translocoService
                .selectTranslateObject('DAY_PART_OPTIONS', {}, (this.scope as ProviderScope).scope)
                .pipe(
                  map((result) => [
                    { label: result.morning, value: { morning: true } },
                    { label: result.afternoon, value: { afternoon: true } },
                  ])
                ),
            },
            hideExpression: (model) => model?.type !== DurationType.HalfDay,
            expressionProperties: {
              className: (model) => (model?.type !== DurationType.HalfDay ? 'hidden' : 'mt-6 block'),
            },
          },
          {
            key: 'time',
            fieldGroupClassName: 'grid grid-cols-2 gap-x-4',
            fieldGroup: [
              {
                key: 'from',
                type: 'input-time',
                templateOptions: {
                  translate: true,
                  label: 'from',
                  labelClassName: 'font-semibold',
                  required: true,
                  textfieldLabelOutside: true,
                },
              },
              {
                key: 'to',
                type: 'input-time',
                templateOptions: {
                  translate: true,
                  label: 'to',
                  labelClassName: 'font-semibold',
                  required: true,
                  textfieldLabelOutside: true,
                },
              },
            ],
            hideExpression: (model, formState, field) => field?.form?.value.type !== DurationType.SpecifyTime,
            expressionProperties: {
              className: (model, formState, field) =>
                field?.form?.value.type !== DurationType.SpecifyTime ? 'hidden' : 'col-span-2',
            },
          },
        ],
        hideExpression: (model, formState, field) =>
          !field?.parent?.formControl?.value?.fromTo ||
          !(
            field.parent.formControl.value.fromTo.isSingleDay ||
            [PartialDays.AllDays, PartialDays.StartDayOnly, PartialDays.StartEndDay].includes(formState.partialDays)
          ),
      },
      {
        key: 'endDay',
        className: 'tui-form__row block',
        fieldGroupClassName: 'grid grid-cols-3 gap-x-4',
        fieldGroup: [
          {
            key: 'type',
            type: 'select',
            defaultValue: DurationType.HalfDay,
            templateOptions: {
              translate: true,
              options: [],
              label: 'endDay',
              labelClassName: 'font-semibold',
              valueProp: 'value',
              translocoScope: this.scope,
              required: true,
            },
            hooks: {
              onInit: (field) => {
                if (field?.templateOptions) {
                  field.templateOptions.options = this.translocoService
                    .selectTranslateObject('LEAVE_DURATION_OPTIONS', {}, (this.scope as ProviderScope).scope)
                    .pipe(
                      map((result) => [
                        { label: result.halfDay, value: DurationType.HalfDay },
                        { label: result.specifyTime, value: DurationType.SpecifyTime },
                      ])
                    );
                }
              },
            },
          },
          {
            key: 'value',
            type: 'select',
            templateOptions: {
              required: true,
              valueProp: 'value',
              options: this.translocoService
                .selectTranslateObject('DAY_PART_OPTIONS', {}, (this.scope as ProviderScope).scope)
                .pipe(
                  map((result) => [
                    { label: result.morning, value: { morning: true } },
                    { label: result.afternoon, value: { afternoon: true } },
                  ])
                ),
            },
            hideExpression: (model) => model?.type !== DurationType.HalfDay,
            expressionProperties: {
              className: (model) => (model?.type !== DurationType.HalfDay ? 'hidden' : 'mt-6 block'),
            },
          },
          {
            key: 'time',
            fieldGroupClassName: 'grid grid-cols-2 gap-x-4',
            fieldGroup: [
              {
                key: 'from',
                type: 'input-time',
                templateOptions: {
                  translate: true,
                  label: 'from',
                  labelClassName: 'font-semibold',
                  required: true,
                  textfieldLabelOutside: true,
                },
              },
              {
                key: 'to',
                type: 'input-time',
                templateOptions: {
                  translate: true,
                  label: 'to',
                  labelClassName: 'font-semibold',
                  required: true,
                  textfieldLabelOutside: true,
                },
              },
            ],
            hideExpression: (model, formState, field) => field?.form?.value.type !== DurationType.SpecifyTime,
            expressionProperties: {
              className: (model, formState, field) =>
                field?.form?.value.type !== DurationType.SpecifyTime ? 'hidden' : 'col-span-2',
            },
          },
        ],
        hideExpression: (model, formState) =>
          ![PartialDays.EndDayOnly, PartialDays.StartEndDay].includes(formState.partialDays),
      },
      {
        key: 'sendTo',
        className: 'tui-form__row block',
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
        key: 'comment',
        className: 'tui-form__row block',
        type: 'text-area',
        templateOptions: {
          translate: true,
          labelClassName: 'font-semibold',
          rows: 4,
          label: 'Comment',
          textfieldLabelOutside: true,
          required: true,
        },
      },
    ];
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };

      formModel.fromDate = (this.model.fromTo?.from as TuiDay).toLocalNativeDate().getTime();
      formModel.toDate = endOfDay((this.model.fromTo?.to as TuiDay).toLocalNativeDate()).getTime();
      if (formModel.leaveType) {
        formModel.leaveTypeId = formModel.leaveType[0]?.leaveTypeId as string;
      }
      formModel.partialDayTypeId = formModel.partialDays?.id as string;
      formModel.items = [];
      if (formModel.startDay) {
        switch (formModel.startDay.type) {
          case DurationType.FullDay:
            formModel.items.push({ fullDay: true });
            break;
          case DurationType.HalfDay:
            formModel.items.push(formModel.startDay.value);
            break;
          case DurationType.SpecifyTime:
            formModel.items.push({
              fromTime: formModel.startDay.time.from.toAbsoluteMilliseconds() / 1000,
              toTime: formModel.startDay.time.to.toAbsoluteMilliseconds() / 1000,
            });
            break;
        }
      }
      if (formModel.endDay) {
        switch (formModel.endDay.type) {
          case DurationType.HalfDay:
            formModel.items.push(formModel.endDay.value);
            break;
          case DurationType.SpecifyTime:
            formModel.items.push({
              fromTime: formModel.endDay.time.from.toAbsoluteMilliseconds() / 1000,
              toTime: formModel.endDay.time.to.toAbsoluteMilliseconds() / 1000,
            });
            break;
        }
      }
      delete formModel.leaveType;
      delete formModel.fromTo;
      delete formModel.partialDays;
      delete formModel.startDay;
      delete formModel.endDay;
      this.submit$.next(formModel);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}

@NgModule({
  declarations: [CreateLeaveRequestDialogComponent],
  imports: [CommonModule, BaseFormComponentModule, PolymorpheusModule, TranslocoModule],
  exports: [CreateLeaveRequestDialogComponent],
})
export class CreateLeaveRequestDialogComponentModule {}