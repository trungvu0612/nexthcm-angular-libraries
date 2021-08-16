import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { PromptService, tuiTimeAfter, tuiTimeBefore } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDay, TuiTime } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { tap } from 'rxjs/operators';
import { RequestStatus } from '../../../../enums';
import { SubmitRequestPayload } from '../../../../models';
import { MyTimeService, RequestTypeAPIUrlPath } from '../../../../services';

@Component({
  selector: 'hcm-submit-update-timesheet-request-dialog',
  templateUrl: './submit-update-timesheet-request-dialog.component.html',
  styleUrls: ['./submit-update-timesheet-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitUpdateTimesheetRequestDialogComponent {
  readonly form = this.fb.group<SubmitRequestPayload>({} as SubmitRequestPayload);
  model = {} as SubmitRequestPayload;
  readonly fields: FormlyFieldConfig[] = [
    { key: 'timeSheetId', defaultValue: this.context.data },
    { key: 'status', defaultValue: RequestStatus.waiting },
    {
      key: 'createdDate',
      className: 'tui-form__row block',
      type: 'input-date',
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
            label: 'newInTime',
            labelClassName: 'font-semibold',
            placeholder: 'enterNewInTime',
            required: true,
            textfieldLabelOutside: true,
          },
          validators: { validation: [tuiTimeBefore('newOutTime')] },
          validation: {
            messages: { tuiTimeBefore: () => this.translocoService.translate('MY_TIME.inTimeBeforeOutTime') },
          },
        },
        {
          key: 'newOutTime',
          type: 'input-time',
          templateOptions: {
            translate: true,
            label: 'newOutTime',
            labelClassName: 'font-semibold',
            placeholder: 'enterNewOutTime',
            required: true,
            textfieldLabelOutside: true,
          },
          validators: { validation: [tuiTimeAfter('newInTime')] },
          validation: {
            messages: { tuiTimeAfter: () => this.translocoService.translate('MY_TIME.outTimeAfterInTime') },
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
      type: 'select',
      templateOptions: {
        translate: true,
        label: 'sendTo',
        labelClassName: 'font-semibold',
        placeholder: 'chooseAPerson',
        options: this.myTimeService.select('sendToUsers'),
        labelProp: 'username',
        valueProp: 'id',
      },
    },
  ];

  constructor(
    private fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) readonly context: TuiDialogContext<boolean, string>,
    private myTimeService: MyTimeService,
    private promptService: PromptService,
    private translocoService: TranslocoService
  ) {}

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };
      formModel.createdDate = (formModel.createdDate as TuiDay).toLocalNativeDate().valueOf();
      formModel.newInTime = (formModel.newInTime as TuiTime).toAbsoluteMilliseconds() / 1000;
      formModel.newOutTime = (formModel.newOutTime as TuiTime).toAbsoluteMilliseconds() / 1000;
      this.myTimeService
        .submitRequest(RequestTypeAPIUrlPath.updateTimesheet, formModel)
        .pipe(tap(() => this.promptService.handleResponse()))
        .subscribe(() => this.context.completeWith(true));
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
