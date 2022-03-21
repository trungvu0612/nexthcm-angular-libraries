import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { BaseOption, BaseUser, EmployeesService, PromptService, WorkflowStatus } from '@nexthcm/cdk';
import { BaseFormComponentModule } from '@nexthcm/ui';
import { HashMap, ProviderScope, TRANSLOCO_SCOPE, TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { TuiDayRange } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { TuiTagModule } from '@taiga-ui/kit';
import { POLYMORPHEUS_CONTEXT, PolymorpheusModule, PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';
import { endOfDay, getTime } from 'date-fns';
import omit from 'just-omit';
import { from, of, Subject } from 'rxjs';
import { catchError, map, share, startWith, switchMap, tap } from 'rxjs/operators';

import { MyTimeService } from '../../../services';
import { RequestType, WorkingAfterHoursType } from '../../enums';
import { WorkingAfterHoursRequestPayload } from '../../models';
import { MyRequestsService } from '../../services';

interface WorkingAfterHoursRequestForm extends WorkingAfterHoursRequestPayload {
  user?: BaseUser;
  durationInHours?: number;
  fromTo?: TuiDayRange;
  sendToUser?: BaseUser[];
}

@Component({
  selector: 'hcm-create-working-after-hours-request-dialog',
  templateUrl: './create-working-after-hours-request-dialog.component.html',
  styleUrls: ['./create-working-after-hours-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateWorkingAfterHoursRequestDialogComponent implements OnInit {
  @ViewChild('statusContent', { static: true }) statusContent!: PolymorpheusTemplate<WorkflowStatus>;

  readonly statusContext!: { $implicit: WorkflowStatus };
  model = {} as WorkingAfterHoursRequestForm;
  readonly form = this.fb.group(this.model);
  fields!: FormlyFieldConfig[];
  readonly submit$ = new Subject<WorkingAfterHoursRequestPayload>();
  readonly submitHandler$ = this.submit$.pipe(
    switchMap((payload) =>
      this.myRequestsService.submitRequest('workingAfterHours', payload).pipe(
        switchMap(() =>
          from(
            this.promptService.open({
              icon: 'success',
              html: this.translocoService.translate(this.translocoScope.scope + '.submitRequestSuccessfully'),
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
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, boolean>,
    private readonly myRequestsService: MyRequestsService,
    private readonly promptService: PromptService,
    private readonly translocoService: TranslocoService,
    private readonly myTimeService: MyTimeService,
    private readonly employeesService: EmployeesService
  ) {}

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
        key: 'type',
        className: 'tui-form__row block',
        type: 'select',
        defaultValue: WorkingAfterHoursType.Overtime,
        templateOptions: {
          translate: true,
          label: 'type',
          labelClassName: 'font-semibold',
          valueProp: 'value',
          options: this.translocoService
            .selectTranslateObject<HashMap<string>>('WORKING_AFTER_HOURS_TYPE', {}, this.translocoScope.scope)
            .pipe(
              map(
                (result) =>
                  [
                    { label: result['OVERTIME'], value: WorkingAfterHoursType.Overtime },
                    { label: result['WORKING_AFTERTIME'], value: WorkingAfterHoursType.WorkingAfterHours },
                  ] as BaseOption<number>[]
              )
            ),
        },
      },
      {
        key: 'fromTo',
        className: 'tui-form__row block',
        type: 'input-date-range',
        templateOptions: {
          translate: true,
          label: 'dateRange',
          labelClassName: 'font-semibold',
          placeholder: 'chooseDateRange',
          required: true,
          textfieldLabelOutside: true,
        },
      },
      {
        key: 'durationInHours',
        className: 'tui-form__row block',
        type: 'input-number',
        templateOptions: {
          translate: true,
          label: 'totalWorkingTimeH',
          labelClassName: 'font-semibold',
          placeholder: this.translocoScope.scope + '.enterTotalWorkingHours',
          required: true,
          textfieldLabelOutside: true,
          precision: 1,
          min: 0,
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
          options: this.myTimeService.getSecondWorkflowStatus(RequestType.WorkingAfterHours),
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
          serverRequest: (searchQuery: string) => this.employeesService.searchEmployees(searchQuery),
        },
      },
    ];
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel: WorkingAfterHoursRequestForm = { ...this.form.value };

      if (formModel.user) {
        formModel.userId = formModel.user.id;
      }
      if (formModel.fromTo) {
        formModel.fromDate = getTime(formModel.fromTo.from.toLocalNativeDate());
        formModel.toDate = getTime(endOfDay(formModel.fromTo.to.toLocalNativeDate()));
      }
      if (formModel.sendToUser) formModel.sendToIds = formModel.sendToUser.map(({ id }) => id);
      formModel.duration = Number(formModel.durationInHours) * 3600;

      this.submit$.next(omit(formModel, ['user', 'fromTo', 'durationInHours', 'sendToUser']));
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}

@NgModule({
  declarations: [CreateWorkingAfterHoursRequestDialogComponent],
  imports: [CommonModule, BaseFormComponentModule, TranslocoModule, PushModule, PolymorpheusModule, TuiTagModule],
  exports: [CreateWorkingAfterHoursRequestDialogComponent],
})
export class CreateWorkingAfterHoursRequestDialogComponentModule {}
