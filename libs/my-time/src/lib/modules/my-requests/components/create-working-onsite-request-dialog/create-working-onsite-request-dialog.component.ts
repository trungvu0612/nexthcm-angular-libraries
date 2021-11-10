import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import { BaseObject, BaseUser, loadOnsiteOffices, OnsiteOfficesQuery, PromptService } from '@nexthcm/cdk';
import { Control, FormBuilder } from '@ng-stack/forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDayRange, TuiTime } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { endOfDay, getTime } from 'date-fns';
import { from, of, Subject } from 'rxjs';
import { catchError, map, share, startWith, switchMap, tap } from 'rxjs/operators';
import { WorkingOnsiteRequestPayload } from '../../../../internal/models';
import { MyRequestsService } from '../../../../internal/services';

interface WorkingOnsiteRequestForm extends WorkingOnsiteRequestPayload {
  durationTime?: Control<TuiTime>;
  fromTo?: Control<TuiDayRange>;
  sendToUser?: Control<BaseUser>;
  officeDTO: Control<BaseObject>;
}

@Component({
  selector: 'hcm-create-working-onsite-request-dialog',
  templateUrl: './create-working-onsite-request-dialog.component.html',
  styleUrls: ['./create-working-onsite-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateWorkingOnsiteRequestDialogComponent {
  model = {} as WorkingOnsiteRequestForm;
  readonly form = this.fb.group<WorkingOnsiteRequestForm>(this.model);
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
      key: 'durationTime',
      type: 'input-time',
      templateOptions: {
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
      key: 'officeDTO',
      className: 'tui-form__row block',
      type: 'select',
      templateOptions: {
        translate: true,
        label: 'office',
        labelClassName: 'font-semibold',
        options: this.onsiteOfficesQuery.selectAll(),
        placeholder: 'chooseOffice',
        labelProp: 'name',
        matcherBy: 'id',
        required: true,
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
  readonly submit$ = new Subject<WorkingOnsiteRequestPayload>();
  readonly submitHandler$ = this.submit$.pipe(
    switchMap((payload) =>
      this.myRequestsService.submitRequest('workingOnsite', payload).pipe(
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
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean>,
    private readonly myRequestsService: MyRequestsService,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService,
    private readonly onsiteOfficesQuery: OnsiteOfficesQuery,
    actions: Actions
  ) {
    actions.dispatch(loadOnsiteOffices());
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };

      if (formModel.fromTo) {
        formModel.fromDate = getTime(formModel.fromTo.from.toLocalNativeDate());
        formModel.toDate = getTime(endOfDay(formModel.fromTo.to.toLocalNativeDate()));
      }
      if (formModel.durationTime) {
        formModel.duration = formModel.durationTime.toAbsoluteMilliseconds().valueOf() / 1000;
      }
      if (formModel.sendToUser) {
        formModel.sendTo = formModel.sendToUser.id;
      }

      delete formModel.fromTo;
      delete formModel.durationTime;
      delete formModel.sendToUser;
      this.submit$.next(formModel);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
