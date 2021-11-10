import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { BaseUser, PromptService } from '@nexthcm/cdk';
import { Control, FormBuilder } from '@ng-stack/forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDayRange, TuiTime } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { endOfDay, getTime } from 'date-fns';
import { from, of, Subject } from 'rxjs';
import { catchError, map, share, startWith, switchMap, tap } from 'rxjs/operators';
import { WorkFromHomeRequestPayload } from '../../../../internal/models';
import { MyRequestsService } from '../../../../internal/services';

interface WorkFromHomeRequestForm extends WorkFromHomeRequestPayload {
  totalTime?: Control<TuiTime>;
  fromTo?: Control<TuiDayRange>;
  sendToUser?: Control<BaseUser>;
}

@Component({
  selector: 'hcm-create-work-from-home-request-dialog',
  templateUrl: './create-work-from-home-request-dialog.component.html',
  styleUrls: ['./create-work-from-home-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateWorkFromHomeRequestDialogComponent {
  model = {} as WorkFromHomeRequestForm;
  readonly form = this.fb.group<WorkFromHomeRequestForm>(this.model);
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
      key: 'totalTime',
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
  ];
  readonly submit$ = new Subject<WorkFromHomeRequestPayload>();
  readonly submitHandler$ = this.submit$.pipe(
    switchMap((payload) =>
      this.myRequestsService.submitRequest('workFromHome', payload).pipe(
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
    share(),
  );
  readonly submitLoading$ = this.submitHandler$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    private readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean>,
    private readonly myRequestsService: MyRequestsService,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService,
  ) {}

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };

      if (formModel.fromTo) {
        formModel.fromDate = getTime(formModel.fromTo.from.toLocalNativeDate());
        formModel.toDate = getTime(endOfDay(formModel.fromTo.to.toLocalNativeDate()));
      }
      if (formModel.totalTime) {
        formModel.totalDay = formModel.totalTime.toAbsoluteMilliseconds().valueOf() / 1000;
      }
      if (formModel.sendToUser) {
        formModel.sendTo = formModel.sendToUser.id;
      }

      delete formModel.fromTo;
      delete formModel.totalTime;
      delete formModel.sendToUser;
      this.submit$.next(formModel);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
