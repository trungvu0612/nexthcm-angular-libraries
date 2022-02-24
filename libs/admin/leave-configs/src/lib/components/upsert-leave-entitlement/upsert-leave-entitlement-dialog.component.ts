import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import { AuthService } from '@nexthcm/auth';
import { JobTitlesQuery, loadJobTitles, PromptService } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDay, TuiDayRange, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { endOfDay, getTime } from 'date-fns';
import { of, Subject } from 'rxjs';
import { catchError, map, share, startWith, switchMap, tap } from 'rxjs/operators';

import { AdminLeaveConfigsService } from '../../admin-leave-configs.service';
import { LeaveConfigUrlPaths, LeaveEntitlement } from '../../models';
import { TRANSLATION_SCOPE } from '../../translation-scope';

@Component({
  selector: 'hcm-upsert-leave-entitlement-dialog',
  templateUrl: './upsert-leave-entitlement-dialog.component.html',
  styleUrls: ['./upsert-leave-entitlement-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UpsertLeaveEntitlementDialogComponent implements OnInit {
  readonly leaveConfigAPIUrlPath: keyof LeaveConfigUrlPaths = 'leaveEntitlement';
  form = this.fb.group<LeaveEntitlement>({} as LeaveEntitlement);
  model = {} as LeaveEntitlement;
  fields: FormlyFieldConfig[] = [
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
      key: 'leaveType',
      className: 'tui-form__row block',
      type: 'combo-box',
      templateOptions: {
        translate: true,
        label: 'leaveType',
        labelClassName: 'font-semibold',
        placeholder: 'searchLeaveTypes',
        required: true,
        serverRequest: (searchQuery: string) => this.leaveConfigsService.searchLeaveTypes(searchQuery),
        matcherBy: 'id',
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'status',
      className: 'tui-form__row block',
      type: 'checkbox-labeled',
      defaultValue: true,
      templateOptions: {
        labelClassName: 'font-semibold',
        translate: true,
        label: `${TRANSLATION_SCOPE}.multipleEmployees`,
      },
    },
    {
      key: 'employeeDTO',
      className: 'tui-form__row block',
      type: 'user-combo-box',
      templateOptions: {
        translate: true,
        label: 'employee',
        labelClassName: 'font-semibold',
        placeholder: 'searchEmployees',
        textfieldLabelOutside: true,
      },
      hideExpression: 'model.status',
    },
    {
      key: 'orgDTO',
      className: 'tui-form__row block',
      type: 'select-org-tree',
      templateOptions: {
        translate: true,
        label: 'department',
        labelClassName: 'font-semibold',
        placeholder: 'chooseDepartment',
      },
      hideExpression: '!model.status',
    },
    {
      key: 'jobTitleDTOList',
      className: 'tui-form__row block',
      type: 'multi-select-search',
      templateOptions: {
        translate: true,
        label: 'jobTitles',
        labelClassName: 'font-semibold',
        textfieldLabelOutside: true,
        placeholder: 'searchJobTitles',
        serverRequest: (searchQuery: string) => this.jobTitlesQuery.searchJobTitles(searchQuery),
      },
      hideExpression: '!model.status',
    },
    {
      key: 'entitlement',
      className: 'tui-form__row block',
      type: 'input-number',
      templateOptions: {
        required: true,
        translate: true,
        labelClassName: 'font-semibold',
        label: `${TRANSLATION_SCOPE}.entitlementDays`,
        placeholder: `${TRANSLATION_SCOPE}.enterDays`,
        textfieldLabelOutside: true,
        min: 1,
        precision: 0,
      },
    },
    { key: 'id' },
  ];
  readonly submit$ = new Subject<LeaveEntitlement>();
  readonly submitHandler$ = this.submit$.pipe(
    switchMap((payload) =>
      this.leaveConfigsService.upsert(this.leaveConfigAPIUrlPath, payload).pipe(
        tap(
          this.promptService.handleResponse(
            payload.id
              ? 'leaveConfigs.editLeaveEntitlementSuccessfully'
              : 'leaveConfigs.createLeaveEntitlementSuccessfully',
            () => this.context.completeWith(true)
          )
        ),
        catchError(() => of({})),
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
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, LeaveEntitlement>,
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly translocoService: TranslocoService,
    private readonly leaveConfigsService: AdminLeaveConfigsService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly jobTitlesQuery: JobTitlesQuery,
    actions: Actions
  ) {
    actions.dispatch(loadJobTitles());
  }

  ngOnInit(): void {
    if (this.context.data) {
      this.model = {
        ...this.model,
        ...this.context.data,
        status: !!this.context.data.status,
        fromTo: new TuiDayRange(
          TuiDay.fromLocalNativeDate(new Date(this.context.data.fromDate)),
          TuiDay.fromLocalNativeDate(new Date(this.context.data.toDate))
        ),
      };
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };

      if (formModel.status) {
        formModel.orgId = formModel.orgDTO?.id;
      } else {
        formModel.employeeId = formModel.employeeDTO?.id;
      }
      formModel.status = formModel.status ? 1 : 0;
      if (formModel.fromTo) {
        formModel.fromDate = getTime(formModel.fromTo.from.toLocalNativeDate());
        formModel.toDate = getTime(endOfDay(formModel.fromTo.to.toLocalNativeDate()));
      }
      delete formModel.fromTo;
      this.submit$.next(formModel);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
