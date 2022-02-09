import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { BaseUser, PromptService, WorkflowStatus } from '@nexthcm/cdk';
import { BaseFormComponentModule } from '@nexthcm/ui';
import { TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { TuiDayRange } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { TuiTagModule } from '@taiga-ui/kit';
import { POLYMORPHEUS_CONTEXT, PolymorpheusModule, PolymorpheusTemplate } from '@tinkoff/ng-polymorpheus';
import { endOfDay, getTime } from 'date-fns';
import omit from 'just-omit';
import { combineLatest, from, of, Subject } from 'rxjs';
import { catchError, map, share, startWith, switchMap, take, tap } from 'rxjs/operators';
import { MyTimeService } from '../../../services';
import { RequestType } from '../../enums';
import { WorkFromHomeRequestPayload } from '../../models';
import { MyRequestsService } from '../../services';

interface WorkFromHomeRequestForm extends WorkFromHomeRequestPayload {
  user?: BaseUser;
  fromTo?: TuiDayRange;
  sendToUser?: BaseUser;
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
  readonly form = this.fb.group(this.model);
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

  get userControl(): AbstractControl | null {
    return this.form.get('user');
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
        asyncValidators: {
          dateRange: {
            expression: (control: AbstractControl) =>
              !control.valueChanges || control.pristine
                ? of(true)
                : combineLatest([
                    this.userControl
                      ? this.userControl.valueChanges.pipe(startWith(this.userControl.value))
                      : of(undefined),
                    control.valueChanges,
                  ]).pipe(
                    take(1),
                    switchMap(() =>
                      this.myRequestsService.checkDuplicateRequestTime<WorkFromHomeRequestForm>(
                        'workFromHome',
                        this.parseFormModel({
                          user: this.userControl?.value,
                          fromTo: control.value,
                        })
                      )
                    ),
                    tap(() => control.markAsTouched())
                  ),
            message: () => this.translocoService.selectTranslate('VALIDATION.duplicateRequestTime'),
          },
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
          textfieldCleaner: true,
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

  parseFormModel(model: Partial<WorkFromHomeRequestForm>): WorkFromHomeRequestPayload {
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
    return omit(formModel, ['user', 'fromTo', 'totalTime', 'sendToUser']) as WorkFromHomeRequestPayload;
  }
}

@NgModule({
  declarations: [CreateWorkFromHomeRequestDialogComponent],
  imports: [CommonModule, BaseFormComponentModule, TranslocoModule, PushModule, TuiTagModule, PolymorpheusModule],
  exports: [CreateWorkFromHomeRequestDialogComponent],
})
export class CreateWorkFromHomeRequestDialogComponentModule {}
