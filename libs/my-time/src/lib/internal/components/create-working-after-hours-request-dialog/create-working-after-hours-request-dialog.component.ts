import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { BaseOption, BaseUser, PromptService } from '@nexthcm/cdk';
import { BaseFormComponentModule } from '@nexthcm/ui';
import { Control, FormBuilder } from '@ng-stack/forms';
import { HashMap, TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { TuiDayRange } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { endOfDay, getTime } from 'date-fns';
import { from, of, Subject } from 'rxjs';
import { catchError, map, share, startWith, switchMap, tap } from 'rxjs/operators';
import { TRANSLATION_SCOPE } from '../../constants';
import { WorkingAfterHoursType } from '../../enums';
import { WorkingAfterHoursRequestPayload } from '../../models';
import { MyRequestsService } from '../../services';

interface WorkingAfterHoursRequestForm extends WorkingAfterHoursRequestPayload {
  user?: Control<BaseUser>;
  durationInHours?: number;
  fromTo?: Control<TuiDayRange>;
  sendToUser?: Control<BaseUser>;
}

@Component({
  selector: 'hcm-create-working-after-hours-request-dialog',
  templateUrl: './create-working-after-hours-request-dialog.component.html',
  styleUrls: ['./create-working-after-hours-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateWorkingAfterHoursRequestDialogComponent {
  model = {} as WorkingAfterHoursRequestForm;
  readonly form = this.fb.group<WorkingAfterHoursRequestForm>(this.model);
  readonly fields: FormlyFieldConfig[] = [
    {
      key: 'user',
      className: 'tui-form__row block',
      type: 'user-combo-box',
      templateOptions: {
        translate: true,
        required: true,
        label: 'employee',
        labelClassName: 'font-semibold',
        placeholder: 'searchEmployees',
      },
      hide: !!this.context.data,
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
          .selectTranslateObject<HashMap<string>>('WORKING_AFTER_HOURS_TYPE', {}, TRANSLATION_SCOPE)
          .pipe(
            map(
              (result) =>
                [
                  { label: result.OVERTIME, value: WorkingAfterHoursType.Overtime },
                  { label: result.WORKING_AFTERTIME, value: WorkingAfterHoursType.WorkingAfterHours },
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
        label: 'myTime.totalWorkingTimeH',
        labelClassName: 'font-semibold',
        placeholder: 'myTime.enterTotalWorkingHours',
        required: true,
        textfieldLabelOutside: true,
        precision: 1,
        min: 0,
      },
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
      type: 'user-combo-box',
      templateOptions: {
        translate: true,
        label: 'sendTo',
        labelClassName: 'font-semibold',
        placeholder: 'searchUsers',
        labelProp: 'name',
        textfieldLabelOutside: true,
      },
    },
    { key: 'userId', defaultValue: this.authService.get('userInfo', 'userId') },
  ];
  readonly submit$ = new Subject<WorkingAfterHoursRequestPayload>();
  readonly submitHandler$ = this.submit$.pipe(
    switchMap((payload) =>
      this.myRequestsService.submitRequest('workingAfterHours', payload).pipe(
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
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, string>,
    private readonly myRequestsService: MyRequestsService,
    private readonly promptService: PromptService,
    private readonly translocoService: TranslocoService,
    private readonly authService: AuthService
  ) {}

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };

      if (formModel.user) {
        formModel.userId = formModel.user.id;
      }
      if (formModel.fromTo) {
        formModel.fromDate = getTime(formModel.fromTo.from.toLocalNativeDate());
        formModel.toDate = getTime(endOfDay(formModel.fromTo.to.toLocalNativeDate()));
      }
      if (formModel.sendToUser) {
        formModel.sendTo = formModel.sendToUser.id;
      }
      formModel.duration = Number(formModel.durationInHours) * 3600;

      delete formModel.fromTo;
      delete formModel.durationInHours;
      delete formModel.sendToUser;

      this.submit$.next(formModel);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}

@NgModule({
  declarations: [CreateWorkingAfterHoursRequestDialogComponent],
  imports: [CommonModule, BaseFormComponentModule, TranslocoModule, PushModule],
  exports: [CreateWorkingAfterHoursRequestDialogComponent],
})
export class CreateWorkingAfterHoursRequestDialogComponentModule {}
