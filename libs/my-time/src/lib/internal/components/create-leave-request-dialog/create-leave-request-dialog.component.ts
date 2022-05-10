import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors } from '@angular/forms';
import { BaseUser, EmployeesService, isDateRangeSameYear, PromptService, WorkflowStatus } from '@nexthcm/cdk';
import { BaseFormComponentModule } from '@nexthcm/ui';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyHookFn } from '@ngx-formly/core/lib/components/formly.field.config';
import { PushModule } from '@rx-angular/template';
import { TuiDay, TuiDayRange, TuiDestroyService, TuiTime } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { TuiTagModule } from '@taiga-ui/kit';
import { POLYMORPHEUS_CONTEXT, PolymorpheusModule, PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';
import { endOfDay } from 'date-fns';
import omit from 'just-omit';
import { combineLatest, from, iif, merge, of, Subject } from 'rxjs';
import { catchError, map, share, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';

import { PartialDaysType } from '../../../models';
import { MyTimeService } from '../../../services';
import { DurationType, PartialDays, RequestType } from '../../enums';
import { LeaveRequestPayload, PayloadTimeItem, RemainingLeaveEntitlement, SingleDayItem } from '../../models';
import { MyLeaveService, MyRequestsService } from '../../services';

interface LeaveRequestForm extends LeaveRequestPayload {
  employee?: BaseUser;
  escalateDTO?: BaseUser;
  items: PayloadTimeItem[];
  leaveType?: [RemainingLeaveEntitlement];
  fromTo?: TuiDayRange;
  partialDays?: PartialDaysType;
  startDay?: SingleDayItem;
  endDay?: SingleDayItem;
  sendToUser?: BaseUser[];
}

function FromToValidator(control: FormControl): ValidationErrors | null {
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
  form = this.fb.group(this.model);
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
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private readonly fb: FormBuilder,
    private readonly myLeaveService: MyLeaveService,
    private readonly myRequestsService: MyRequestsService,
    private readonly myTimeService: MyTimeService,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, string>,
    private readonly translocoService: TranslocoService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly employeesService: EmployeesService
  ) {}

  get currentUserId(): string {
    return this.context.data;
  }

  ngOnInit(): void {
    const valueOnInit: FormlyHookFn = (field) => {
      if (field?.templateOptions && field.formControl) {
        field.templateOptions.options = this.translocoService
          .selectTranslateObject('DAY_PART_OPTIONS', {}, this.translocoScope.scope)
          .pipe(
            map((result) => [
              { label: result.morning, value: { morning: true } },
              { label: result.afternoon, value: { afternoon: true } },
            ]),
            tap((items) => field.formControl?.value || field.formControl?.setValue(items[0].value))
          );
      }
    };

    const fromTimeOnInit: FormlyHookFn = (field) => {
      const fromControl = field?.form?.get('from');
      const toControl = field?.form?.get('to');

      fromControl?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((from: TuiTime | null) => {
        const to = toControl?.value as TuiTime | null;
        if (from && to) {
          if (from.toAbsoluteMilliseconds() > to.toAbsoluteMilliseconds()) fromControl.setErrors({ startTime: true });
          else if (toControl?.errors) toControl.setErrors(null);
        }
      });

      toControl?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((to: TuiTime | null) => {
        const from = fromControl?.value as TuiTime | null;
        if (from && to) {
          if (from.toAbsoluteMilliseconds() > to.toAbsoluteMilliseconds()) toControl.setErrors({ endTime: true });
          else if (fromControl?.errors) fromControl.setErrors(null);
        }
      });
    };

    const startTimeMessage = () =>
      this.translocoService.selectTranslate(this.translocoScope.scope + '.startTimeMustBeEarlierThanEndTime');
    const endTimeMessage = () =>
      this.translocoService.selectTranslate(this.translocoScope.scope + '.endTimeMustBeLaterThanEndTime');

    this.fields = [
      {
        key: 'employee',
        type: 'user-combo-box',
        className: 'tui-form__row block',
        templateOptions: {
          translate: true,
          label: 'employee',
          labelClassName: 'font-semibold',
          placeholder: 'searchEmployees',
        },
        hideExpression: () => !!this.currentUserId,
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
            sameYear: () =>
              this.translocoService.selectTranslate('leaveDateRangeSameYear', {}, this.translocoScope.scope),
          },
        },
      },
      {
        key: 'leaveType',
        className: 'tui-form__row block',
        type: 'filter',
        templateOptions: {
          required: true,
          translate: true,
          label: 'leaveType',
          labelClassName: 'font-semibold',
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
            required: () => this.translocoService.selectTranslate('leaveTypeRequired', {}, this.translocoScope.scope),
          },
        },
        hooks: {
          onInit: (field) => {
            if (field?.templateOptions && field.form?.controls['fromTo']) {
              field.templateOptions.options = merge(
                field.form.controls['employee']?.valueChanges.pipe(map((employee) => employee?.id)) || of(null),
                field.form.controls['fromTo'].valueChanges.pipe(startWith(field.form.controls['fromTo'].value))
              ).pipe(
                switchMap(() => {
                  const employeeId = field.model.employee?.id || this.currentUserId;
                  const fromTo = field.model.fromTo;

                  if (employeeId && fromTo && isDateRangeSameYear(fromTo)) {
                    const fromDate = (fromTo.from as TuiDay).toLocalNativeDate().getTime();
                    const toDate = endOfDay((fromTo.to as TuiDay).toLocalNativeDate()).getTime();

                    return this.myLeaveService
                      .getEmployeeLeaveEntitlements(employeeId, fromDate, toDate)
                      .pipe(startWith(null as any));
                  } else return of([]);
                })
              );
            }
          },
        },
        hideExpression: '!model.fromTo',
      },
      {
        key: 'partialDays',
        className: 'tui-form__row block',
        type: 'select',
        templateOptions: {
          translate: true,
          label: 'myTime.partialDays',
          labelClassName: 'font-semibold',
          options: [],
          labelProp: 'name',
          required: true,
          customContent: this.partialDaysContent,
        },
        hooks: {
          onInit: (field) => {
            if (field?.templateOptions && field.formControl) {
              field.formControl.valueChanges
                .pipe(takeUntil(this.destroy$))
                .subscribe((partialDays: PartialDaysType) => (this.options.formState.partialDays = partialDays?.type));

              field.templateOptions.options = this.myLeaveService
                .select('partialDayTypes')
                .pipe(tap((items) => field.formControl?.value || field.formControl?.setValue(items[0])));
            }
          },
        },
        hideExpression: (model: LeaveRequestForm) => !model.fromTo || model.fromTo.isSingleDay,
      },
      {
        key: 'startDay',
        className: 'tui-form__row block',
        fieldGroupClassName: 'grid grid-cols-3 gap-4',
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
                const fromToControl = (field?.parent?.form as FormGroup)?.controls?.['fromTo'] as FormControl;

                if (fromToControl && field?.templateOptions) {
                  field.templateOptions.options = combineLatest([
                    this.translocoService.selectTranslateObject(
                      'LEAVE_DURATION_OPTIONS',
                      {},
                      this.translocoScope.scope
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
                switchMap((key) => this.translocoService.selectTranslate(key, {}, this.translocoScope.scope))
              ),
            },
          },
          {
            key: 'value',
            type: 'select',
            className: 'block mt-6',
            templateOptions: {
              required: true,
              valueProp: 'value',
              options: [],
            },
            hooks: { onInit: valueOnInit },
            hideExpression: (model) => model?.type !== DurationType.HalfDay,
          },
          {
            key: 'time',
            className: 'col-span-2',
            fieldGroupClassName: 'grid grid-cols-2 gap-x-4',
            fieldGroup: [
              {
                key: 'from',
                type: 'input-time',
                templateOptions: {
                  translate: true,
                  label: 'from',
                  required: true,
                  textfieldLabelOutside: false,
                },
                hooks: { onInit: fromTimeOnInit },
                validation: { messages: { startTime: startTimeMessage } },
              },
              {
                key: 'to',
                type: 'input-time',
                templateOptions: {
                  translate: true,
                  label: 'to',
                  required: true,
                  textfieldLabelOutside: false,
                },
                validation: { messages: { endTime: endTimeMessage } },
              },
            ],
            hideExpression: (_, __, field) => field?.form?.value.type !== DurationType.SpecifyTime,
          },
        ],
        hideExpression: (_, formState, field) =>
          !field?.parent?.formControl?.value?.fromTo ||
          !(
            field.parent.formControl.value.fromTo.isSingleDay ||
            [PartialDays.AllDays, PartialDays.StartDayOnly, PartialDays.StartEndDay].includes(formState.partialDays)
          ),
      },
      {
        key: 'endDay',
        className: 'tui-form__row block',
        fieldGroupClassName: 'grid grid-cols-3 gap-4',
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
                    .selectTranslateObject('LEAVE_DURATION_OPTIONS', {}, this.translocoScope.scope)
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
            className: 'block mt-6',
            templateOptions: {
              required: true,
              valueProp: 'value',
              options: [],
            },
            hooks: { onInit: valueOnInit },
            hideExpression: (model) => model?.type !== DurationType.HalfDay,
          },
          {
            key: 'time',
            className: 'col-span-2',
            fieldGroupClassName: 'grid grid-cols-2 gap-x-4',
            fieldGroup: [
              {
                key: 'from',
                type: 'input-time',
                templateOptions: {
                  translate: true,
                  label: 'from',
                  required: true,
                  textfieldLabelOutside: false,
                },
                hooks: { onInit: fromTimeOnInit },
                validation: { messages: { startTime: startTimeMessage } },
              },
              {
                key: 'to',
                type: 'input-time',
                templateOptions: {
                  translate: true,
                  label: 'to',
                  required: true,
                  textfieldLabelOutside: false,
                },
                validation: { messages: { endTime: endTimeMessage } },
              },
            ],
            hideExpression: (_, __, field) => field?.form?.value.type !== DurationType.SpecifyTime,
          },
        ],
        hideExpression: (_, formState) =>
          !formState.partialDays || ![PartialDays.EndDayOnly, PartialDays.StartEndDay].includes(formState.partialDays),
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
            if (field?.templateOptions && this.form.controls['leaveType']) {
              field.templateOptions.options = this.form.controls['leaveType'].valueChanges.pipe(
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
        key: 'escalateDTO',
        className: 'tui-form__row block',
        type: 'assignee',
        templateOptions: {
          translate: true,
          label: 'assignee',
          labelClassName: 'font-semibold',
          textfieldLabelOutside: true,
        },
        hooks: {
          onInit: (field) => {
            const employeeCtrl = field?.parent?.formControl?.get('employee');
            const employeeId$ = this.currentUserId
              ? of(this.currentUserId)
              : employeeCtrl
              ? employeeCtrl.valueChanges.pipe(map((employee) => employee?.id))
              : of(undefined);

            employeeId$
              .pipe(
                switchMap((employeeId) =>
                  iif(
                    () => !!employeeId,
                    this.employeesService.getDirectSupervisor(employeeId as string),
                    of(undefined)
                  )
                ),
                takeUntil(this.destroy$)
              )
              .subscribe((employee) => {
                field?.formControl?.patchValue(employee);
              });
          },
        },
      },
      {
        key: 'sendToUser',
        className: 'tui-form__row block',
        type: 'multi-select-search',
        templateOptions: {
          translate: true,
          labelClassName: 'font-semibold',
          placeholder: 'searchUsers',
          label: 'emailCC',
          subLabelProp: 'username',
          textfieldLabelOutside: true,
          matcherBy: 'id',
          serverRequest: (searchQuery: string) => this.employeesService.searchEmployees(searchQuery),
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
      const formModel: LeaveRequestForm = { ...this.form.value };

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
      if (formModel.sendToUser) formModel.sendToIds = formModel.sendToUser.map(({ id }) => id);

      this.submit$.next(
        omit(formModel, [
          'employee',
          'leaveType',
          'fromTo',
          'partialDays',
          'startDay',
          'endDay',
          'sendToUser',
          'escalateDTO',
        ])
      );
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}

@NgModule({
  declarations: [CreateLeaveRequestDialogComponent],
  imports: [CommonModule, BaseFormComponentModule, PolymorpheusModule, TranslocoModule, TuiTagModule, PushModule],
  exports: [CreateLeaveRequestDialogComponent],
})
export class CreateLeaveRequestDialogComponentModule {}
