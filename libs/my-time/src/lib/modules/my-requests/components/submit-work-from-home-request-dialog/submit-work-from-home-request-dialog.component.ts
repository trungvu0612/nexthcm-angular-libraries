import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { PromptService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiTime } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { endOfDay, getTime } from 'date-fns';
import { Subject } from 'rxjs';
import { filter, map, share, startWith, switchMap, tap } from 'rxjs/operators';
import { SubmitRequestPayload } from '../../../../models';
import { MyTimeService } from '../../../../services';

@Component({
  selector: 'hcm-submit-work-from-home-request-dialog',
  templateUrl: './submit-work-from-home-request-dialog.component.html',
  styleUrls: ['./submit-work-from-home-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class SubmitWorkFromHomeRequestDialogComponent {
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
      key: 'totalDay',
      type: 'input-time',
      templateOptions: {
        required: true,
        translate: true,
        label: 'myTime.estimateTime',
        labelClassName: 'font-semibold',
        textfieldLabelOutside: true,
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
    switchMap((payload) => this.myTimeService.submitRequest('workFromHome', payload).pipe(startWith(null))),
    share()
  );
  readonly submitLoading$ = this.submitHandler$.pipe(map((value) => !value));

  constructor(
    private readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean>,
    private readonly myTimeService: MyTimeService,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService,
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
      }
      if (formModel.totalDay) {
        formModel.totalDay = (formModel.totalDay as TuiTime).toAbsoluteMilliseconds().valueOf() / 1000;
      }
      delete formModel.fromTo;
      this.submit$.next(formModel);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
