import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, OnInit, ViewChild } from '@angular/core';
import { BaseUser, PromptService, WorkflowStatus } from '@nexthcm/cdk';
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
import { WorkFromHomeRequestPayload } from '../../models';
import { MyRequestsService } from '../../services';

interface WorkFromHomeRequestForm extends WorkFromHomeRequestPayload {
  user?: Control<BaseUser>;
  fromTo?: Control<TuiDayRange>;
  sendToUser?: Control<BaseUser>;
}

@Component({
  selector: 'hcm-create-work-from-home-request-dialog',
  templateUrl: './create-work-from-home-request-dialog.component.html',
  styleUrls: ['./create-work-from-home-request-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateWorkFromHomeRequestDialogComponent implements OnInit {
  @ViewChild('statusContent', { static: true }) statusContent!: PolymorpheusTemplate<WorkflowStatus>;

  readonly statusContext!: { $implicit: WorkflowStatus };
  model = {} as WorkFromHomeRequestForm;
  readonly requestTypeUrlPath = 'workFromHome';
  readonly form = this.fb.group<WorkFromHomeRequestForm>(this.model);
  fields!: FormlyFieldConfig[];
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
    private readonly myTimeService: MyTimeService
  ) {}

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
          options: this.myTimeService.getSecondWorkflowStatus(RequestType.WorkFromHome),
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
      this.submit$.next(this.parseFormModel({ ...this.form.value }));
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }

  parseFormModel(model: WorkFromHomeRequestForm): WorkFromHomeRequestPayload {
    const formModel = { ...model };

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
    return omit(formModel, ['user', 'fromTo', 'totalTime', 'sendToUser']);
  }
}

@NgModule({
  declarations: [CreateWorkFromHomeRequestDialogComponent],
  imports: [CommonModule, BaseFormComponentModule, TranslocoModule, PushModule, TuiTagModule, PolymorpheusModule],
  exports: [CreateWorkFromHomeRequestDialogComponent],
})
export class CreateWorkFromHomeRequestDialogComponentModule {}
