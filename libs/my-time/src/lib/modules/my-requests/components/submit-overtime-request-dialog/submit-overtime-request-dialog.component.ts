import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { BaseOption, PromptService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { HashMap, ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { isPresent } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { endOfDay, getTime } from 'date-fns';
import { of, Subject } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, tap } from 'rxjs/operators';
import { WorkingAfterHoursType } from '../../../../enums';
import { SubmitRequestPayload } from '../../../../models';
import { MyTimeService } from '../../../../services';

@Component({
  selector: 'hcm-submit-overtime-request-dialog',
  templateUrl: './submit-overtime-request-dialog.component.html',
  styleUrls: ['./submit-overtime-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class SubmitOvertimeRequestDialogComponent {
  readonly form = this.fb.group<SubmitRequestPayload>({} as SubmitRequestPayload);
  model = {} as SubmitRequestPayload;
  readonly fields: FormlyFieldConfig[] = [
    { key: 'userId', defaultValue: this.authService.get('userInfo', 'userId') },
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
          .selectTranslateObject<HashMap<string>>('WORKING_AFTER_HOURS_TYPE', {}, (this.scope as ProviderScope).scope)
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
      key: 'duration',
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
      key: 'sendTo',
      className: 'tui-form__row block',
      type: 'user-combo-box',
      templateOptions: {
        translate: true,
        label: 'sendTo',
        labelClassName: 'font-semibold',
        placeholder: 'chooseAPerson',
        labelProp: 'name',
        valueProp: 'id',
        textfieldLabelOutside: true,
      },
    },
  ];
  readonly submit$ = new Subject<SubmitRequestPayload>();
  readonly submitHandler$ = this.submit$.pipe(
    switchMap((payload) => this.myTimeService.submitRequest('workingAfterHours', payload).pipe(startWith(null))),
    share()
  );
  readonly submitLoading$ = this.submitHandler$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    private readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean>,
    private readonly myTimeService: MyTimeService,
    private readonly promptService: PromptService,
    private readonly translocoService: TranslocoService,
    private readonly authService: AuthService,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
    state: RxState<Record<string, unknown>>
  ) {
    state.hold(
      this.submitHandler$.pipe(
        filter(isPresent),
        tap(
          () => this.context.completeWith(true),
          (error) =>
            this.promptService.open({
              icon: 'error',
              text: this.translocoService.translate(`ERRORS.${error.error.message}`),
            })
        )
      )
    );
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };

      if (formModel.fromTo) {
        formModel.fromDate = getTime(formModel.fromTo.from.toLocalNativeDate());
        formModel.toDate = getTime(endOfDay(formModel.fromTo.to.toLocalNativeDate()));
        formModel.duration = Number(formModel?.duration) * 3600;
      }
      delete formModel.fromTo;
      this.submit$.next(formModel);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
