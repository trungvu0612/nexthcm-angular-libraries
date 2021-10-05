import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { PromptService, tuiTimeAfter, tuiTimeBefore } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDay, TuiDestroyService, TuiTime } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { of, Subject } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, tap } from 'rxjs/operators';
import { RequestStatus } from '../../../../enums';
import { SubmitRequestPayload, WorkingHours } from '../../../../models';
import { MyTimeService } from '../../../../services';

@Component({
  selector: 'hcm-submit-update-timesheet-request-dialog',
  templateUrl: './submit-update-timesheet-request-dialog.component.html',
  styleUrls: ['./submit-update-timesheet-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class SubmitUpdateTimesheetRequestDialogComponent {
  readonly form = this.fb.group<SubmitRequestPayload>({} as SubmitRequestPayload);
  model = {} as SubmitRequestPayload;
  readonly fields: FormlyFieldConfig[] = [
    { key: 'timeSheetId', defaultValue: this.context.data.id },
    { key: 'status', defaultValue: RequestStatus.waiting },
    {
      key: 'createdDate',
      className: 'tui-form__row block',
      type: 'input-date',
      defaultValue: TuiDay.fromLocalNativeDate(new Date(this.context.data.trackingDate)),
      templateOptions: {
        translate: true,
        label: 'date',
        labelClassName: 'font-semibold',
        placeholder: 'chooseADate',
        required: true,
        textfieldLabelOutside: true,
      },
    },
    {
      fieldGroupClassName: 'grid grid-cols-2 gap-4 mt-5',
      fieldGroup: [
        {
          key: 'newInTime',
          type: 'input-time',
          templateOptions: {
            translate: true,
            label: 'myTime.newInTime',
            labelClassName: 'font-semibold',
            placeholder: 'myTime.enterNewInTime',
            required: true,
            textfieldLabelOutside: true,
          },
          validators: { validation: [tuiTimeBefore('newOutTime')] },
          validation: {
            messages: { tuiTimeBefore: () => this.translocoService.translate('myTime.inTimeBeforeOutTime') },
          },
        },
        {
          key: 'newOutTime',
          type: 'input-time',
          templateOptions: {
            translate: true,
            label: 'myTime.newOutTime',
            labelClassName: 'font-semibold',
            placeholder: 'myTime.enterNewOutTime',
            required: true,
            textfieldLabelOutside: true,
          },
          validators: { validation: [tuiTimeAfter('newInTime')] },
          validation: {
            messages: { tuiTimeAfter: () => this.translocoService.translate('myTime.outTimeAfterInTime') },
          },
        },
      ],
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
        labelProp: 'username',
        valueProp: 'id',
      },
    },
  ];
  readonly submit$ = new Subject<SubmitRequestPayload>();
  readonly submitHandler$ = this.submit$.pipe(
    switchMap((payload) => this.myTimeService.submitRequest('updateTimesheet', payload).pipe(startWith(null))),
    share()
  );
  readonly submitLoading$ = this.submitHandler$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    private readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, WorkingHours>,
    private readonly myTimeService: MyTimeService,
    private readonly promptService: PromptService,
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
                html: this.translocoService.translate('myTime.updateTimesheetSuccess'),
              })
              .then(() => this.context.completeWith(true)),
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

      formModel.createdDate = (formModel.createdDate as TuiDay).toLocalNativeDate().valueOf();
      formModel.newInTime = (formModel.newInTime as TuiTime).toAbsoluteMilliseconds() / 1000;
      formModel.newOutTime = (formModel.newOutTime as TuiTime).toAbsoluteMilliseconds() / 1000;
      this.submit$.next(formModel);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
