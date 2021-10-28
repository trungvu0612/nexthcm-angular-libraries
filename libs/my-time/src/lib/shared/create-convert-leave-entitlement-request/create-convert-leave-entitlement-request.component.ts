import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule } from '@angular/core';
import { AuthService } from '@nexthcm/auth';
import { PromptService } from '@nexthcm/cdk';
import { BaseFormComponentModule } from '@nexthcm/ui';
import { FormBuilder } from '@ngneat/reactive-forms';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { of, Subject } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  share,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { TransferLeaveEntitlementType } from '../../internal/enums';
import { RemainingLeaveEntitlement } from '../../internal/models';
import { TransferLeaveEntitlementPayload } from '../../internal/models/requests/transfer-leave-entitlement-payload';
import { MyLeaveService } from '../../services';

@Component({
  selector: 'hcm-create-convert-leave-entitlement-request',
  templateUrl: './create-convert-leave-entitlement-request.component.html',
  styleUrls: ['./create-convert-leave-entitlement-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateConvertLeaveEntitlementRequestComponent {
  model = {} as TransferLeaveEntitlementPayload;
  form = this.fb.group<TransferLeaveEntitlementPayload>(this.model);
  readonly remainingEntitlement$ = this.form.valueChanges.pipe(
    map((value) => value.leaveTypeRemainingEntitlement?.remainingEntitlement),
    share()
  );
  fields: FormlyFieldConfig[] = [
    {
      key: 'leaveTypeRemainingEntitlement',
      className: 'tui-form__row block',
      type: 'select',
      templateOptions: {
        translate: true,
        required: true,
        label: 'leaveType',
        labelClassName: 'font-semibold',
        placeholder: 'chooseLeaveType',
        options: this.context.data,
        labelProp: 'leaveTypeName',
      },
    },
    {
      expressionProperties: {
        template: this.remainingEntitlement$.pipe(
          filter(isPresent),
          switchMap((value) => this.translocoService.selectTranslate('remainingEntitlement', { value }, this.scope))
        ),
        className: this.remainingEntitlement$.pipe(
          map((value) => (typeof value === 'number' ? 'tui-form__row block' : 'hidden'))
        ),
      },
    },
    {
      key: 'typeTransfer',
      className: 'tui-form__row block',
      type: 'select',
      defaultValue: TransferLeaveEntitlementType.TransferToSalary,
      templateOptions: {
        translate: true,
        label: 'type',
        labelClassName: 'font-semibold',
        placeholder: 'chooseType',
        valueProp: 'value',
        required: true,
        options: this.translocoService
          .selectTranslateObject('TRANSFER_LEAVE_ENTITLEMENT_TYPES', {}, (this.scope as ProviderScope).scope)
          .pipe(
            map((result) => [
              { label: result.transferToSalary, value: TransferLeaveEntitlementType.TransferToSalary },
              {
                label: result.transferEntitlementToAnotherLeaveTypeInNextPeriod,
                value: TransferLeaveEntitlementType.TransferEntitlementToAnotherLeaveTypeOfNextPeriod,
              },
            ])
          ),
      },
    },
    {
      key: 'leaveTypeId',
      className: 'tui-form__row block',
      type: 'select',
      templateOptions: {
        translate: true,
        required: true,
        label: 'canTransferEntitlementsTo',
        labelClassName: 'font-semibold',
        placeholder: 'chooseLeaveType',
        options: this.myLeaveService.getCanConvertToLeaveTypes(),
        labelProp: 'name',
        valueProp: 'id',
        translocoScope: this.scope,
      },
      hideExpression: (model: TransferLeaveEntitlementPayload) =>
        model.typeTransfer !== TransferLeaveEntitlementType.TransferEntitlementToAnotherLeaveTypeOfNextPeriod,
    },
    {
      key: 'durationInDayTransfer',
      className: 'tui-form__row block',
      type: 'input-count',
      templateOptions: {
        translate: true,
        label: 'numberOfDays',
        labelClassName: 'font-semibold',
        required: true,
        min: 1,
        textfieldLabelOutside: true,
      },
      expressionProperties: {
        'templateOptions.max': this.form.valueChanges.pipe(
          map((formModel) => formModel.leaveTypeRemainingEntitlement),
          filter(isPresent),
          distinctUntilChanged(),
          switchMap((leaveType) =>
            this.form.value.typeTransfer === TransferLeaveEntitlementType.TransferToSalary
              ? this.myLeaveService
                  .getMaximumLeaveEntitlementsCanTransfer(
                    this.authService.get('userInfo', 'userId'),
                    leaveType.leaveTypeId
                  )
                  .pipe(map((res) => Math.min(leaveType.remainingEntitlement, res)))
              : of(Infinity)
          )
        ),
      },
    },
    {
      key: 'sendTo',
      className: 'tui-form__row block',
      type: 'user-combo-box',
      templateOptions: {
        required: true,
        translate: true,
        labelClassName: 'font-semibold',
        placeholder: 'searchUsers',
        label: 'sendTo',
        textfieldLabelOutside: true,
        labelProp: 'name',
        valueProp: 'id',
      },
    },
  ];
  readonly submit$ = new Subject<TransferLeaveEntitlementPayload>();
  readonly submitHandler$ = this.submit$.pipe(
    switchMap((payload) =>
      this.myLeaveService
        .submitConvertLeaveEntitlementsRequest(payload)
        .pipe(
          tap(
            this.promptService.handleResponse('myTime.submitRequestSuccessfully', () => this.context.completeWith(true))
          ),
          startWith(null)
        )
    ),
    share(),
    takeUntil(this.destroy$)
  );
  readonly submitLoading$ = this.submitHandler$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly myLeaveService: MyLeaveService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly translocoService: TranslocoService,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, RemainingLeaveEntitlement[]>,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope
  ) {}

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };

      if (formModel.typeTransfer === TransferLeaveEntitlementType.TransferToSalary) {
        formModel.leaveTypeId = formModel.leaveTypeRemainingEntitlement.leaveTypeId;
      }
      this.submit$.next(formModel);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}

@NgModule({
  imports: [BaseFormComponentModule, CommonModule],
  declarations: [CreateConvertLeaveEntitlementRequestComponent],
  exports: [CreateConvertLeaveEntitlementRequestComponent],
})
export class CreateConvertLeaveEntitlementRequestComponentModule {}
