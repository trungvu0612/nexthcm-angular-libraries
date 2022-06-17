import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgModule } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { AuthService } from '@nexthcm/auth';
import { BaseUser, EmployeesService, PromptService } from '@nexthcm/cdk';
import { BaseFormComponentModule } from '@nexthcm/ui';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { isPresent } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import omit from 'just-omit';
import { of, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map, share, startWith, switchMap, tap } from 'rxjs/operators';

import { TransferLeaveEntitlementType } from '../../enums';
import { RemainingLeaveEntitlement, TransferLeaveEntitlementPayload } from '../../models';
import { MyLeaveService } from '../../services';

interface TransferLeaveEntitlementForm extends TransferLeaveEntitlementPayload {
  leaveTypeRemainingEntitlement: RemainingLeaveEntitlement;
  sendToUser?: BaseUser[];
}

@Component({
  selector: 'hcm-create-transfer-leave-entitlement-request',
  templateUrl: './create-transfer-leave-entitlement-request.component.html',
  styleUrls: ['./create-transfer-leave-entitlement-request.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateTransferLeaveEntitlementRequestComponent {
  model = {} as TransferLeaveEntitlementForm;
  form = this.fb.group(this.model);
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
          switchMap((value) =>
            this.translocoService.selectTranslate('remainingEntitlement', { value }, this.translocoScope.scope)
          )
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
      defaultValue: TransferLeaveEntitlementType.transferToSalary,
      templateOptions: {
        translate: true,
        label: 'type',
        labelClassName: 'font-semibold',
        placeholder: 'chooseType',
        valueProp: 'value',
        required: true,
        options: this.translocoService
          .selectTranslateObject('TRANSFER_LEAVE_ENTITLEMENT_TYPES', {}, this.translocoScope.scope)
          .pipe(
            map((result) => [
              { label: result.transferToSalary, value: TransferLeaveEntitlementType.transferToSalary },
              {
                label: result.transferEntitlementToAnotherLeaveTypeInNextPeriod,
                value: TransferLeaveEntitlementType.transferEntitlementToAnotherLeaveTypeInNextPeriod,
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
        label: `${this.translocoScope.scope}.canTransferEntitlementsTo`,
        labelClassName: 'font-semibold',
        placeholder: 'chooseLeaveType',
        options: this.myLeaveService.getCanConvertToLeaveTypes(),
        labelProp: 'name',
        valueProp: 'id',
      },
      hideExpression: (model: TransferLeaveEntitlementPayload) =>
        model.typeTransfer !== TransferLeaveEntitlementType.transferEntitlementToAnotherLeaveTypeInNextPeriod,
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
            this.form.value.typeTransfer === TransferLeaveEntitlementType.transferToSalary
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
      key: 'sendToUser',
      className: 'tui-form__row block',
      type: 'multi-select-search',
      templateOptions: {
        required: true,
        translate: true,
        labelClassName: 'font-semibold',
        placeholder: 'searchUsers',
        label: 'emailCC',
        subLabelProp: 'username',
        textfieldLabelOutside: true,
        matcherBy: 'id',
        serverRequest: (searchQuery: string) => this.employeesService.searchEmployees(searchQuery),
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
    share()
  );
  readonly submitLoading$ = this.submitHandler$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, RemainingLeaveEntitlement[]>,
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private readonly fb: UntypedFormBuilder,
    private readonly authService: AuthService,
    private readonly myLeaveService: MyLeaveService,
    private readonly promptService: PromptService,
    private readonly translocoService: TranslocoService,
    private readonly employeesService: EmployeesService
  ) {}

  onSubmit(): void {
    if (this.form.valid) {
      const formModel: TransferLeaveEntitlementForm = { ...this.form.value };

      if (formModel.typeTransfer === TransferLeaveEntitlementType.transferToSalary) {
        formModel.leaveTypeId = formModel.leaveTypeRemainingEntitlement.leaveTypeId;
      }
      if (formModel.sendToUser) formModel.sendToIds = formModel.sendToUser.map(({ id }) => id);

      this.submit$.next(omit(formModel, 'sendToUser'));
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}

@NgModule({
  imports: [BaseFormComponentModule, CommonModule, PushModule],
  declarations: [CreateTransferLeaveEntitlementRequestComponent],
  exports: [CreateTransferLeaveEntitlementRequestComponent],
})
export class CreateConvertLeaveEntitlementRequestComponentModule {}
