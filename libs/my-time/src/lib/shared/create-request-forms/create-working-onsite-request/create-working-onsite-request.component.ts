import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { BaseUser, EmployeesService, OfficesService, PromptService, WorkflowStatus } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDayRange } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT, PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';
import { endOfDay, getTime } from 'date-fns';
import omit from 'just-omit';
import { combineLatest, from, of, Subject } from 'rxjs';
import { catchError, map, share, startWith, switchMap, take, tap } from 'rxjs/operators';

import { RequestType } from '../../../internal/enums';
import { WorkingOnsiteRequestPayload } from '../../../internal/models';
import { MyRequestsService } from '../../../internal/services';
import { MyTimeService } from '../../../services';
import { isDuplicateDateRangeInList } from '../utils/duplicate-date-ranges-in-list';

interface WorkingOnsiteRequestForm extends WorkingOnsiteRequestPayload {
  user?: BaseUser;
  sendToUser?: BaseUser[];
  dateRanges?: { fromTo: TuiDayRange }[];
  fromTo?: TuiDayRange;
}

@Component({
  selector: 'hcm-create-working-onsite-request',
  templateUrl: './create-working-onsite-request.component.html',
  styleUrls: ['./create-working-onsite-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateWorkingOnsiteRequestComponent implements OnInit {
  @ViewChild('statusContent', { static: true }) statusContent!: PolymorpheusTemplate<WorkflowStatus>;

  readonly statusContext!: { $implicit: WorkflowStatus };
  readonly form = this.fb.group({});
  model = { dateRanges: [{}] } as WorkingOnsiteRequestForm;
  fields!: FormlyFieldConfig[];
  readonly submit$ = new Subject<WorkingOnsiteRequestPayload>();
  readonly submitHandler$ = this.submit$.pipe(
    switchMap((payload) =>
      this.myRequestsService.submitRequest('workingOnsite', payload).pipe(
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
          from(this.promptService.open({ icon: 'error', html: this.promptService.generateErrorMessage(err) }))
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
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, boolean>,
    private readonly myRequestsService: MyRequestsService,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService,
    private readonly officesService: OfficesService,
    private readonly myTimeService: MyTimeService,
    private readonly employeesService: EmployeesService
  ) {
    officesService.doLoadOnsiteOffices();
  }

  get userControl(): AbstractControl | null {
    return this.form.get('user');
  }

  ngOnInit(): void {
    this.fields = [
      {
        key: 'user',
        className: 'tui-form__row block',
        type: 'user-combo-box',
        templateOptions: {
          translate: true,
          label: 'employee',
          labelClassName: 'font-semibold',
          placeholder: 'searchEmployees',
        },
        hide: this.context.data,
        expressionProperties: {
          'templateOptions.required': () => !this.context.data,
        },
      },
      {
        key: 'dateRanges',
        type: 'repeat',
        className: 'tui-form__row block',
        templateOptions: {
          translate: true,
          label: 'dateRange',
          labelClassName: 'font-semibold',
        },
        fieldArray: {
          fieldGroup: [
            {
              key: 'fromTo',
              className: 'tui-form__row block',
              type: 'input-date-range',
              templateOptions: {
                translate: true,
                placeholder: 'chooseDateRange',
                required: true,
                textfieldLabelOutside: true,
              },
              asyncValidators: {
                dateRange: {
                  expression: (control: AbstractControl) =>
                    !control.valueChanges || control.pristine
                      ? of(true)
                      : combineLatest([
                          this.userControl
                            ? this.userControl.valueChanges.pipe(startWith(this.userControl.value))
                            : of(undefined),
                          control.valueChanges,
                        ]).pipe(
                          take(1),
                          switchMap(([, dateRange]) =>
                            dateRange
                              ? isDuplicateDateRangeInList(dateRange, this.model.dateRanges || [])
                                ? of(false)
                                : this.myRequestsService.checkDuplicateRequestTime<WorkingOnsiteRequestPayload>(
                                    'workingOnsite',
                                    this.parseFormModel({ user: this.userControl?.value, fromTo: control.value })
                                  )
                              : of(true)
                          ),
                          tap(() => control.markAsTouched())
                        ),
                  message: () => this.translocoService.selectTranslate('VALIDATION.duplicateRequestTime'),
                },
              },
            },
          ],
        },
      },
      {
        key: 'officeDTO',
        className: 'tui-form__row block',
        type: 'select',
        templateOptions: {
          translate: true,
          label: 'office',
          labelClassName: 'font-semibold',
          options: this.officesService.onsiteOffices$,
          placeholder: 'chooseOffice',
          labelProp: 'name',
          matcherBy: 'id',
          required: true,
        },
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
          options: this.myTimeService.getSecondWorkflowStatus(RequestType.WorkingOnsite),
          customContent: this.statusContent,
          textfieldCleaner: true,
        },
        hide: this.context.data,
      },
      {
        key: 'comment',
        className: 'tui-form__row block',
        type: 'text-area',
        templateOptions: {
          translate: true,
          label: 'Comment',
          labelClassName: 'font-semibold',
          required: true,
          textfieldLabelOutside: true,
        },
      },
      {
        key: 'sendToUser',
        className: 'tui-form__row block',
        type: 'multi-select-search',
        templateOptions: {
          translate: true,
          label: 'emailCC',
          labelClassName: 'font-semibold',
          placeholder: 'searchUsers',
          subLabelProp: 'username',
          textfieldLabelOutside: true,
          matcherBy: 'id',
          serverRequest: (searchQuery: string) => this.employeesService.searchEmployees(searchQuery),
        },
      },
    ];
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submit$.next(this.parseFormModel(this.form.value));
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }

  parseFormModel(formValue: Partial<WorkingOnsiteRequestForm>): WorkingOnsiteRequestPayload {
    const formModel = { ...formValue };

    if (formModel.user) {
      formModel.userId = formModel.user.id;
    }
    if (formModel.fromTo) {
      formModel.fromDate = getTime(formModel.fromTo.from.toLocalNativeDate());
      formModel.toDate = getTime(endOfDay(formModel.fromTo.to.toLocalNativeDate()));
    }
    if (formModel.dateRanges) {
      formModel.dateRangeNotContinuous = formModel.dateRanges.map((dateRange) => ({
        fromDate: getTime(dateRange.fromTo.from.toLocalNativeDate()),
        toDate: getTime(endOfDay(dateRange.fromTo.to.toLocalNativeDate())),
      }));
    }
    if (formModel.sendToUser) formModel.sendToIds = formModel.sendToUser.map(({ id }) => id);

    return omit(formModel, [
      'user',
      'fromTo',
      'durationTime',
      'sendToUser',
      'dateRanges',
    ]) as WorkingOnsiteRequestPayload;
  }
}
