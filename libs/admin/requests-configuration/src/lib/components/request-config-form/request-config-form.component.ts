import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { PromptService, WorkflowsService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { of, Subject, takeUntil } from 'rxjs';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';

import { AdminRequestsConfigurationService } from '../../admin-requests-configuration.service';
import { RequestConfig } from '../../models/request-config';

@Component({
  selector: 'hcm-request-config-form',
  templateUrl: './request-config-form.component.html',
  styleUrls: ['./request-config-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class RequestConfigFormComponent {
  @Output() cancel = new EventEmitter();

  model = {} as RequestConfig;
  form = this.fb.group(this.model);
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'flex space-x-2 items-end',
      fieldGroup: [
        {
          key: 'workflow',
          type: 'select',
          className: 'flex-1',
          templateOptions: {
            translate: true,
            label: 'workflow',
            labelClassName: 'font-semibold',
            placeholder: 'chooseWorkflow',
            options: this.workflowsService.workflows$,
            labelProp: 'name',
            required: true,
          },
        },
        {
          key: 'workflow',
          type: 'view-workflow-button',
        },
      ],
    },
    { key: 'type', templateOptions: { required: true } },
  ];
  readonly submit$ = new Subject<RequestConfig>();
  readonly submitHandler$ = this.submit$.pipe(
    switchMap((payload) =>
      this.adminRequestsConfigurationService.updateRequestConfig(payload).pipe(
        tap(this.promptService.handleResponse(`${this.translocoScope.scope}.configureSuccessfully`)),
        catchError(() => of({})),
        startWith(null)
      )
    )
  );
  readonly loading$ = this.submitHandler$.pipe(map((value) => !value));

  constructor(
    @Inject(TRANSLOCO_SCOPE) private readonly translocoScope: ProviderScope,
    private readonly fb: FormBuilder,
    private readonly workflowsService: WorkflowsService,
    private readonly adminRequestsConfigurationService: AdminRequestsConfigurationService,
    private readonly promptService: PromptService,
    private readonly destroy$: TuiDestroyService
  ) {
    workflowsService.doLoadWorkflows();
  }

  @Input() set data(data: RequestConfig) {
    this.workflowsService.workflows$.pipe(takeUntil(this.destroy$)).subscribe((workflows) => {
      const workflow = workflows.find((workflow) => workflow.id === data.processId);

      if (workflow) {
        this.model = { ...this.model, ...data, workflow };
      }
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };

      if (formModel.workflow) {
        formModel.processId = formModel.workflow.id;
      }
      delete formModel.workflow;
      this.submit$.next(formModel);
    }
  }
}
