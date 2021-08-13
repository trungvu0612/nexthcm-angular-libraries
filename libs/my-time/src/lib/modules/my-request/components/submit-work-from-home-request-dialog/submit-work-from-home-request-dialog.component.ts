import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { PromptService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { tap } from 'rxjs/operators';
import { SubmitRequestPayload } from '../../../../models/interfaces/submit-request-payload';
import { MyTimeService, RequestTypeAPIUrlPath } from '../../../../services';

@Component({
  selector: 'hcm-submit-work-from-home-request-dialog',
  templateUrl: './submit-work-from-home-request-dialog.component.html',
  styleUrls: ['./submit-work-from-home-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubmitWorkFromHomeRequestDialogComponent {
  readonly form = this.fb.group<SubmitRequestPayload>({} as SubmitRequestPayload);
  model = {} as SubmitRequestPayload;
  readonly fields: FormlyFieldConfig[] = [
    {
      className: 'tui-form__row block',
      key: 'fromTo',
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
      className: 'tui-form__row block',
      key: 'sendTo',
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
    {
      className: 'tui-form__row block',
      key: 'comment',
      type: 'text-area',
      templateOptions: {
        translate: true,
        label: 'Comment',
        labelClassName: 'font-semibold',
        required: true,
        textfieldLabelOutside: true,
      },
    },
  ];

  constructor(
    private fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) readonly context: TuiDialogContext<boolean>,
    private myTimeService: MyTimeService,
    private promptService: PromptService
  ) {}

  onSubmit(formModel: SubmitRequestPayload): void {
    if (formModel.fromTo) {
      formModel.fromDate = formModel.fromTo.from.toLocalNativeDate().valueOf();
      formModel.toDate = formModel.fromTo.from.toLocalNativeDate().valueOf();
    }
    delete formModel.fromTo;
    this.myTimeService
      .submitRequest(RequestTypeAPIUrlPath.workFromHome, formModel)
      .pipe(tap(() => this.promptService.handleResponse()))
      .subscribe(() => this.context.completeWith(true));
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
