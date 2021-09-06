import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { PromptService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService, TuiTime } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { endOfDay, getTime } from 'date-fns';
import { takeUntil, tap } from 'rxjs/operators';
import { SubmitRequestPayload } from '../../../../models';
import { MyTimeService, RequestTypeAPIUrlPath } from '../../../../services';

@Component({
  selector: 'hcm-submit-working-outside-request-dialog',
  templateUrl: './submit-working-outside-request-dialog.component.html',
  styleUrls: ['./submit-working-outside-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService]
})
export class SubmitWorkingOutsideRequestDialogComponent {
  readonly form = this.fb.group<SubmitRequestPayload>({} as SubmitRequestPayload);
  model:SubmitRequestPayload = {
    fromDate: undefined,
    toDate: undefined,
    comment: '',
    userId: undefined,
    duration: undefined,
    sendTo: undefined,
    reason: undefined,
    fromTo: undefined,
    status: undefined,
    createdDate: undefined,
    newInTime: undefined,
    newOutTime: undefined
}

  readonly fields: FormlyFieldConfig[] = [
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
        textfieldLabelOutside: true
      },
    },
    {
      key: 'duration',
      type: 'input-time',
      templateOptions: {
        translate: true,
        label: 'Estimate Time',
        labelClassName: 'font-semibold',
        placeholder: 'HH:MM',
        textfieldLabelOutside: true
      },
      hideExpression: '!model.fromTo?.isSingleDay',
      expressionProperties: {
        className: '!model.fromTo || !model.fromTo.isSingleDay ? "hidden" : "col-span-full block mt-4"',
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
        textfieldLabelOutside: true
      }
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
        valueProp: 'id'
      }
    }
  ];

  constructor(
    private fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) readonly context: TuiDialogContext<boolean>,
    private myTimeService: MyTimeService,
    private destroy$: TuiDestroyService,
    private translocoService: TranslocoService,
    private promptService: PromptService
  ) {
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value } as any;
      if (formModel.fromTo) {
        formModel.fromDate = getTime(formModel.fromTo.from.toLocalNativeDate());
        formModel.toDate = getTime(endOfDay(formModel.fromTo.to.toLocalNativeDate()));
      }
      formModel.duration = (formModel.duration as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000;
      delete formModel.fromTo;
      this.myTimeService
        .submitRequest(RequestTypeAPIUrlPath.workingOutside, formModel)
        .pipe(
          tap(() => this.promptService.handleResponse()),
          takeUntil(this.destroy$)
        )
        .subscribe(
          () => this.context.completeWith(true),
          (error) => this.promptService.open(
            { icon: 'error', text: this.translocoService.translate(`ERRORS.${error.error.message}`) })
        );
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
