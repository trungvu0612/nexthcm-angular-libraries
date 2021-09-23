import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { BaseOption, PromptService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { HashMap, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { endOfDay, getTime } from 'date-fns';
import { map, takeUntil } from 'rxjs/operators';
import { WorkingAfterHoursType } from '../../../../enums';
import { SubmitRequestPayload } from '../../../../models';
import { MyTimeService, RequestTypeAPIUrlPath } from '../../../../services';

@Component({
  selector: 'hcm-submit-overtime-request-dialog',
  templateUrl: './submit-overtime-request-dialog.component.html',
  styleUrls: ['./submit-overtime-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
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
        options: this.translocoService.selectTranslateObject<HashMap<string>>('WORKING_AFTER_HOURS_TYPE').pipe(
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
        label: 'totalWorkingTimeH',
        labelClassName: 'font-semibold',
        placeholder: 'enterTotalWorkingHours',
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
        matcherBy: 'id',
        textfieldLabelOutside: true,
      },
    },
  ];

  constructor(
    private fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) readonly context: TuiDialogContext<boolean>,
    private myTimeService: MyTimeService,
    private promptService: PromptService,
    private translocoService: TranslocoService,
    private authService: AuthService,
    private destroy$: TuiDestroyService
  ) {}

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };
      if (formModel.fromTo) {
        formModel.fromDate = getTime(formModel.fromTo.from.toLocalNativeDate());
        formModel.toDate = getTime(endOfDay(formModel.fromTo.to.toLocalNativeDate()));
        formModel.duration = Number(formModel?.duration) * 3600;
      }
      delete formModel.fromTo;
      this.myTimeService
        .submitRequest(RequestTypeAPIUrlPath.WorkingAfterHours, formModel)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          () => this.context.completeWith(true),
          (error) =>
            this.promptService.open({
              icon: 'error',
              text: this.translocoService.translate(`ERRORS.${error.error.message}`),
            })
        );
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
