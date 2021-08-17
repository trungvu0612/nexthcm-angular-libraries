import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { PromptService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { tap } from 'rxjs/operators';
import { SubmitRequestPayload } from '../../../../models';
import { MyTimeService, RequestTypeAPIUrlPath } from '../../../../services';
import { endOfDay, getTime } from 'date-fns';

@Component({
  selector: 'hcm-submit-working-outside-request-dialog',
  templateUrl: './submit-working-outside-request-dialog.component.html',
  styleUrls: ['./submit-working-outside-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitWorkingOutsideRequestDialogComponent {
  readonly form = this.fb.group<SubmitRequestPayload>({} as SubmitRequestPayload);
  model = {} as SubmitRequestPayload;
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
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'duration',
      className: 'tui-form__row block',
      type: 'input-number',
      templateOptions: {
        translate: true,
        label: 'days',
        labelClassName: 'font-semibold',
        placeholder: 'enterNumberOfWorkingDays',
        required: true,
        textfieldLabelOutside: true,
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
    @Inject(POLYMORPHEUS_CONTEXT) readonly context: TuiDialogContext<boolean>,
    private myTimeService: MyTimeService,
    private promptService: PromptService
  ) {}

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };
      if (formModel.fromTo) {
        formModel.fromDate = getTime(formModel.fromTo.from.toLocalNativeDate());
        formModel.toDate = getTime(endOfDay(formModel.fromTo.to.toLocalNativeDate()));
      }
      delete formModel.fromTo;
      this.myTimeService
        .submitRequest(RequestTypeAPIUrlPath.workingOutside, formModel)
        .pipe(tap(() => this.promptService.handleResponse()))
        .subscribe(() => this.context.completeWith(true));
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
