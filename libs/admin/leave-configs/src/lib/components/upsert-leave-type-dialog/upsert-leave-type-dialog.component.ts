import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormBuilder } from '@angular/forms';
import { AuthService } from '@nexthcm/auth';
import { CommonStatus, PromptService, WorkflowsService } from '@nexthcm/cdk';
import { LeaveType } from '@nexthcm/my-time';
import { TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { ProviderScope } from '@ngneat/transloco/lib/types';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { of, Subject } from 'rxjs';
import { catchError, debounceTime, map, share, startWith, switchMap, take, tap } from 'rxjs/operators';

import { AdminLeaveConfigsService } from '../../admin-leave-configs.service';
import { LeaveConfigUrlPaths } from '../../models';

@Component({
  selector: 'hcm-upsert-leave-type-dialog',
  templateUrl: './upsert-leave-type-dialog.component.html',
  styleUrls: ['./upsert-leave-type-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UpsertLeaveTypeDialogComponent implements OnInit {
  readonly leaveConfigAPIUrlPath: keyof LeaveConfigUrlPaths = 'leaveType';
  form = this.fb.group({} as LeaveType);
  model = {} as LeaveType;
  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      className: 'tui-form__row block',
      type: 'input',
      templateOptions: {
        required: true,
        translate: true,
        label: 'name',
        labelClassName: 'font-semibold',
        placeholder: 'enterName',
        textfieldLabelOutside: true,
      },
      asyncValidators: {
        name: {
          expression: (control: AbstractControl) =>
            !control.valueChanges || control.pristine
              ? of(true)
              : control.valueChanges.pipe(
                  debounceTime(1000),
                  take(1),
                  switchMap((name: string) =>
                    this.context.data?.name === name
                      ? of(true)
                      : this.leaveConfigsService.checkLeaveTypeNameExists(name)
                  ),
                  tap(() => control.markAsTouched())
                ),
          message: () => this.translocoService.selectTranslate('VALIDATION.valueExisting'),
        },
      },
    },
    {
      key: 'description',
      className: 'tui-form__row block',
      type: 'text-area',
      templateOptions: {
        translate: true,
        label: 'description',
        labelClassName: 'font-semibold',
        placeholder: 'enterDescription',
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'paidLeave',
      className: 'tui-form__row block',
      type: 'checkbox-labeled',
      defaultValue: true,
      templateOptions: {
        labelClassName: 'font-semibold',
        translate: true,
        label: `${this.translocoScope.scope}.paidLeave`,
      },
    },
    {
      key: 'paidLeaveTransfer',
      className: 'tui-form__row block',
      type: 'checkbox-labeled',
      defaultValue: true,
      templateOptions: {
        labelClassName: 'font-semibold',
        translate: true,
        label: `${this.translocoScope.scope}.canTransferTo`,
      },
    },
    {
      key: 'statusBoolean',
      className: 'tui-form__row block',
      type: 'status-toggle',
      defaultValue: true,
      templateOptions: {
        translate: true,
        label: 'status',
        textfieldLabelOutside: true,
        labelClassName: 'font-semibold',
      },
    },
    {
      key: 'processId',
      className: 'tui-form__row block',
      type: 'select',
      templateOptions: {
        translate: true,
        label: 'workflow',
        labelClassName: 'font-semibold',
        placeholder: 'chooseWorkflow',
        options: this.workflowsService.workflows$,
        labelProp: 'name',
        valueProp: 'id',
        required: true,
      },
    },
    { key: 'id' },
  ];
  readonly submit$ = new Subject<LeaveType>();
  readonly submitHandler$ = this.submit$.pipe(
    switchMap((payload) =>
      this.leaveConfigsService.upsert(this.leaveConfigAPIUrlPath, payload).pipe(
        tap(
          this.promptService.handleResponse(
            `${this.translocoScope.scope}.${payload.id ? 'editLeaveTypeSuccessfully' : 'createLeaveTypeSuccessfully'}`,
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
    @Inject(TRANSLOCO_SCOPE) private readonly translocoScope: ProviderScope,
    @Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean, LeaveType>,
    private readonly fb: UntypedFormBuilder,
    private readonly authService: AuthService,
    private readonly leaveConfigsService: AdminLeaveConfigsService,
    private readonly translocoService: TranslocoService,
    private readonly workflowsService: WorkflowsService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService
  ) {
    workflowsService.doLoadWorkflows();
  }

  ngOnInit(): void {
    if (this.context.data) {
      this.model = {
        ...this.model,
        ...this.context.data,
        statusBoolean: this.context.data.status === CommonStatus.active,
      };
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel: LeaveType = { ...this.form.value };

      formModel.status = formModel.statusBoolean ? CommonStatus.active : CommonStatus.inactive;
      this.submit$.next(formModel);
    }
  }

  onCancel(): void {
    this.context.$implicit.complete();
  }
}
