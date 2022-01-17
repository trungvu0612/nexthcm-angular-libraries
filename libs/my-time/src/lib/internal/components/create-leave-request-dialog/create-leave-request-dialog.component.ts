import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, OnInit, ViewChild } from '@angular/core';
import { BaseUser, isDateRangeSameYear, PromptService, WorkflowStatus } from '@nexthcm/cdk';
import { BaseFormComponentModule } from '@nexthcm/ui';
import { Control, FormBuilder, FormControl, FormGroup, ValidationErrors } from '@ng-stack/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { TuiDay, TuiDayRange, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { TuiTagModule } from '@taiga-ui/kit';
import { POLYMORPHEUS_CONTEXT, PolymorpheusModule, PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';
import { endOfDay } from 'date-fns';
import omit from 'just-omit';
import { combineLatest, from, of, Subject } from 'rxjs';
import { catchError, map, share, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MyTimeService } from '../../../services';
import { TRANSLATION_SCOPE } from '../../constants';
import { DurationType, PartialDays, RequestType } from '../../enums';
import {
  LeaveRequestPayload,
  PartialDaysType,
  PayloadTimeItem,
  RemainingLeaveEntitlement,
  SingleDayItem,
} from '../../models';
import { MyLeaveService, MyRequestsService } from '../../services';

interface LeaveRequestForm extends LeaveRequestPayload {
  employee?: Control<BaseUser>;
  items: Control<PayloadTimeItem[]>;
  leaveType?: Control<[RemainingLeaveEntitlement]>;
  fromTo?: Control<TuiDayRange>;
  partialDays?: Control<PartialDaysType>;
  startDay?: Control<SingleDayItem>;
  endDay?: Control<SingleDayItem>;
  sendToUser?: Control<BaseUser>;
}

function FromToValidator(control: FormControl<TuiDayRange>): ValidationErrors | null {
  return !control.value || isDateRangeSameYear(control.value) ? null : { sameYear: true };
}

@Component({
  selector: 'hcm-create-leave-request-dialog',
  templateUrl: './create-leave-request-dialog.component.html',
  styleUrls: ['./create-leave-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class CreateLeaveRequestDialogComponent implements OnInit {
  @ViewChild('partialDaysContent', { static: true }) partialDaysContent!: PolymorpheusTemplate<PartialDaysType>;
  @ViewChild('statusContent', { static: true }) statusContent!: PolymorpheusTemplate<WorkflowStatus>;

  readonly partialDaysTypeContext!: { $implicit: PartialDaysType };
  readonly statusContext!: { $implicit: WorkflowStatus };
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
              html: this.myRequestsService.generateSubmittingLeaveRequestErrorMessage(err.error),
            })
          )
        ),
        startWith(null)
      )
    ),
    share()
  );
  readonly submitLoading$ = this.submitHandler$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly myLeaveService: MyLeaveService,
    private readonly myRequestsService: MyRequestsService,
    private readonly myTimeService: MyTimeService,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, string>,
    private readonly translocoService: TranslocoService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService
  ) {}

  get currentUserId(): string {
    return this.context.data;
  }

  ngOnInit(): void {
    this.fields = [
      {
        key: 'employee',
        type: 'user-combo-box',
        templateOptions: {
          translate: true,
          label: 'employee',
          labelClassName: 'font-semibold',
          placeholder: 'searchEmployees',
        },
        expressionProperties: {
          className: () => (this.currentUserId ? 'hidden' : 'tui-form__row block'),
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
        validators: {
          validation: [FromToValidator],
        },
        validation: {
          messages: {
            sameYear: () => this.translocoService.selectTranslate('leaveDateRangeSameYear', {}, TRANSLATION_SCOPE),
          },
        },
      },
      {
        key: 'leaveType',
        className: 'tui-form__row block',
        type: 'filter',
        templateOptions: {
          required: true,
          options: [],
          labelProp: 'leaveTypeName',
          single: true,
          badgeHandler: (item: RemainingLeaveEntitlement) => item.remainingEntitlement.toString(),
          identityMatcher: (item1: RemainingLeaveEntitlement, item2: RemainingLeaveEntitlement) =>
            item1.leaveTypeId === item2.leaveTypeId,
          disabledItemHandler: (item: RemainingLeaveEntitlement) => item.remainingEntitlement <= 0,
        },
        validation: {
          messages: {
            required: () => this.translocoService.selectTranslate('leaveTypeRequired', {}, TRANSLATION_SCOPE),
          },
        },
        hooks: {
          onInit: (field) => {
            if (field?.templateOptions && this.form.controls.employee && this.form.controls.fromTo) {
              field.templateOptions.options = combineLatest([
                this.form.controls.employee.valueChanges.pipe(
                  map((employee) => employee?.id),
                  startWith(this.currentUserId)
                ),
                this.form.controls.fromTo.valueChanges,
              ]).pipe(
                switchMap(([employeeId, fromTo]) => {
                  if (employeeId && fromTo && isDateRangeSameYear(fromTo)) {
                    const fromDate = (fromTo.from as TuiDay).toLocalNativeDate().getTime();
                    const toDate = endOfDay((fromTo.to as TuiDay).toLocalNativeDate()).getTime();

                    return this.myLeaveService.getEmployeeLeaveEntitlements(employeeId, fromDate, toDate);
                  } else {
                    return of([]);
                  }
                })
              );
            }
          },
        },
      },
      {
        key: 'partialDays',
        className: 'tui-form__row block',
        type: 'select',
        templateOptions: {
          translate: true,
          label: 'myTime.partialDays',
          labelClassName: 'font-semibold',
          options: this.myLeaveService.select('partialDayTypes'),
          labelProp: 'name',
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
                    this.translocoService.selectTranslateObject('LEAVE_DURATION_OPTIONS', {}, TRANSLATION_SCOPE),
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
                switchMap((key) => this.translocoService.selectTranslate(key, {}, TRANSLATION_SCOPE))
              ),
            },
          },
          {
            key: 'value',
            type: 'select',
            templateOptions: {
              required: true,
              valueProp: 'value',
              options: this.translocoService.selectTranslateObject('DAY_PART_OPTIONS', {}, TRANSLATION_SCOPE).pipe(
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
              label: 'myTime.endDay',
              labelClassName: 'font-semibold',
              valueProp: 'value',
              required: true,
            },
            hooks: {
              onInit: (field) => {
                if (field?.templateOptions) {
                  field.templateOptions.options = this.translocoService
                    .selectTranslateObject('LEAVE_DURATION_OPTIONS', {}, TRANSLATION_SCOPE)
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
              options: this.translocoService.selectTranslateObject('DAY_PART_OPTIONS', {}, TRANSLATION_SCOPE).pipe(
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
        key: 'stateId',
        className: 'tui-form__row block',
        type: 'select',
        templateOptions: {
          translate: true,
          label: 'transitionToStatus',
          labelClassName: 'font-semibold',
          placeholder: 'chooseStatus',
          valueProp: 'id',
          labelProp: 'name',
          options: [],
          customContent: this.statusContent,
          textfieldCleaner: true,
        },
        hooks: {
          onInit: (field) => {
            if (field?.templateOptions && this.form.controls.leaveType) {
              field.templateOptions.options = this.form.controls.leaveType.valueChanges.pipe(
                switchMap((leaveType) => {
                  if (leaveType?.length) {
                    return this.myTimeService
                      .getSecondWorkflowStatus(RequestType.Leave, leaveType[0].leaveTypeId)
                      .pipe(catchError(() => of([])));
                  } else {
                    return of([]);
                  }
                }),
                startWith([])
              );
            }
          },
        },
        hide: !!this.currentUserId,
      },
      {
        key: 'sendToUser',
        className: 'tui-form__row block',
        type: 'user-combo-box',
        templateOptions: {
          translate: true,
          labelClassName: 'font-semibold',
          placeholder: 'searchUsers',
          label: 'sendTo',
          textfieldLabelOutside: true,
          labelProp: 'name',
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

      if (formModel.employee) {
        formModel.employeeId = formModel.employee.id;
      }
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
      if (formModel.sendToUser) {
        formModel.sendTo = formModel.sendToUser.id;
      }

      this.submit$.next(
        omit(formModel, ['employee', 'leaveType', 'fromTo', 'partialDays', 'startDay', 'endDay', 'sendToUser'])
      );
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}

@NgModule({
  declarations: [CreateLeaveRequestDialogComponent],
  imports: [CommonModule, BaseFormComponentModule, PolymorpheusModule, TranslocoModule, TuiTagModule],
  exports: [CreateLeaveRequestDialogComponent],
})
export class CreateLeaveRequestDialogComponentModule {}
