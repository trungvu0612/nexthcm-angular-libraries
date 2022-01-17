import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, OnInit, ViewChild } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import {
  BaseObject,
  BaseUser,
  loadOnsiteOffices,
  OnsiteOfficesQuery,
  PromptService,
  WorkflowStatus,
} from '@nexthcm/cdk';
import { BaseFormComponentModule } from '@nexthcm/ui';
import { Control, FormBuilder } from '@ng-stack/forms';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { TuiDayRange } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { TuiTagModule } from '@taiga-ui/kit';
import { POLYMORPHEUS_CONTEXT, PolymorpheusModule, PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';
import { endOfDay, getTime } from 'date-fns';
import omit from 'just-omit';
import { from, of, Subject } from 'rxjs';
import { catchError, map, share, startWith, switchMap, tap } from 'rxjs/operators';
import { MyTimeService } from '../../../services';
import { RequestType } from '../../enums';
import { WorkingOnsiteRequestPayload } from '../../models';
import { MyRequestsService } from '../../services';

interface WorkingOnsiteRequestForm extends WorkingOnsiteRequestPayload {
  user?: Control<BaseUser>;
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
export class CreateWorkingOnsiteRequestDialogComponent implements OnInit {
  @ViewChild('statusContent', { static: true }) statusContent!: PolymorpheusTemplate<WorkflowStatus>;

  readonly statusContext!: { $implicit: WorkflowStatus };
  model = {} as WorkingOnsiteRequestForm;
  readonly form = this.fb.group<WorkingOnsiteRequestForm>(this.model);
  fields!: FormlyFieldConfig[];
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
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, boolean>,
    private readonly myRequestsService: MyRequestsService,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService,
    private readonly onsiteOfficesQuery: OnsiteOfficesQuery,
    private readonly myTimeService: MyTimeService,
    actions: Actions
  ) {
    actions.dispatch(loadOnsiteOffices());
  }

  ngOnInit(): void {
    this.fields = [
      {
        key: 'user',
        className: 'tui-form__row block',
        type: 'user-combo-box',
        templateOptions: {
          translate: true,
          label: 'employee',
          labelClassName: 'font-semibold',
          placeholder: 'searchEmployees',
        },
        hide: this.context.data,
        expressionProperties: {
          'templateOptions.required': () => !this.context.data,
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
        key: 'stateId',
        className: 'tui-form__row block',
        type: 'select',
        templateOptions: {
          translate: true,
          label: 'transitionToStatus',
          labelClassName: 'font-semibold',
          placeholder: 'chooseStatus',
          valueProp: 'id',
          labelProp: 'name',
          options: this.myTimeService.getSecondWorkflowStatus(RequestType.WorkingOnsite),
          customContent: this.statusContent,
        },
        hide: this.context.data,
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
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };

      if (formModel.user) {
        formModel.userId = formModel.user.id;
      }
      if (formModel.fromTo) {
        formModel.fromDate = getTime(formModel.fromTo.from.toLocalNativeDate());
        formModel.toDate = getTime(endOfDay(formModel.fromTo.to.toLocalNativeDate()));
      }
      if (formModel.sendToUser) {
        formModel.sendTo = formModel.sendToUser.id;
      }

      this.submit$.next(omit(formModel, ['user', 'fromTo', 'durationTime', 'sendToUser']));
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}

@NgModule({
  declarations: [CreateWorkingOnsiteRequestDialogComponent],
  imports: [CommonModule, BaseFormComponentModule, TranslocoModule, PushModule, PolymorpheusModule, TuiTagModule],
  exports: [CreateWorkingOnsiteRequestDialogComponent],
})
export class CreateWorkingOnsiteRequestDialogComponentModule {}
