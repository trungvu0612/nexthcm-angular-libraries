import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { BaseUser, PromptService, tuiTimeAfter, tuiTimeBefore } from '@nexthcm/cdk';
import { Control, FormBuilder } from '@ng-stack/forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDay, TuiTime } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { from, of, Subject } from 'rxjs';
import { catchError, map, share, startWith, switchMap, tap } from 'rxjs/operators';
import { UpdateTimesheetRequestPayload } from '../../../../internal/models';
import { MyRequestsService } from '../../../../internal/services';
import { WorkingHours } from '../../../../models';

interface UpdateTimesheetRequestForm extends UpdateTimesheetRequestPayload {
  date?: Control<TuiDay>;
  inTime?: Control<TuiTime>;
  outTime?: Control<TuiTime>;
  sendToUser?: Control<BaseUser>;
}

@Component({
  selector: 'hcm-create-update-timesheet-request-dialog',
  templateUrl: './create-update-timesheet-request-dialog.component.html',
  styleUrls: ['./create-update-timesheet-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateUpdateTimesheetRequestDialogComponent {
  model = {} as UpdateTimesheetRequestForm;
  readonly form = this.fb.group<UpdateTimesheetRequestForm>(this.model);
  readonly fields: FormlyFieldConfig[] = [
    {
      key: 'date',
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
          key: 'inTime',
          type: 'input-time',
          templateOptions: {
            translate: true,
            label: 'myTime.newInTime',
            labelClassName: 'font-semibold',
            placeholder: 'myTime.enterNewInTime',
            required: true,
            textfieldLabelOutside: true,
          },
          validators: { validation: [tuiTimeBefore('outTime')] },
          validation: {
            messages: { tuiTimeBefore: () => this.translocoService.translate('myTime.inTimeBeforeOutTime') },
          },
        },
        {
          key: 'outTime',
          type: 'input-time',
          templateOptions: {
            translate: true,
            label: 'myTime.newOutTime',
            labelClassName: 'font-semibold',
            placeholder: 'myTime.enterNewOutTime',
            required: true,
            textfieldLabelOutside: true,
          },
          validators: { validation: [tuiTimeAfter('inTime')] },
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
      key: 'sendToUser',
      className: 'tui-form__row block',
      type: 'user-combo-box',
      templateOptions: {
        translate: true,
        label: 'sendTo',
        labelClassName: 'font-semibold',
        placeholder: 'searchUsers',
        labelProp: 'username',
      },
    },
    { key: 'timeSheetId', defaultValue: this.context.data.id },
  ];
  readonly submit$ = new Subject<UpdateTimesheetRequestForm>();
  readonly submitHandler$ = this.submit$.pipe(
    switchMap((payload) =>
      this.myRequestsService.submitRequest('updateTimesheet', payload).pipe(
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
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, WorkingHours>,
    private readonly myRequestsService: MyRequestsService,
    private readonly promptService: PromptService,
    private readonly translocoService: TranslocoService
  ) {}

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };

      if (formModel.date) {
        formModel.createdDate = formModel.date.toLocalNativeDate().valueOf();
      }
      if (formModel.inTime) {
        formModel.newInTime = formModel.inTime.toAbsoluteMilliseconds().valueOf() / 1000;
      }
      if (formModel.outTime) {
        formModel.newOutTime = (formModel.outTime as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000;
      }
      if (formModel.sendToUser) {
        formModel.sendTo = formModel.sendToUser.id;
      }

      delete formModel.date;
      delete formModel.inTime;
      delete formModel.outTime;
      delete formModel.sendToUser;

      this.submit$.next(formModel);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}