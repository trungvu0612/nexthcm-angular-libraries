import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PromptService, WorkflowsQuery } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { of, Subject } from 'rxjs';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';

import { AdminRequestsConfigurationService } from '../../admin-requests-configuration.service';
import { RequestConfig } from '../../request-config';

@Component({
  selector: 'hcm-request-config-form',
  templateUrl: './request-config-form.component.html',
  styleUrls: ['./request-config-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestConfigFormComponent {
  @Output() cancel = new EventEmitter();

  model = {} as RequestConfig;
  form = this.fb.group<RequestConfig>(this.model);
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
            options: this.workflowsQuery.selectAll(),
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
        tap(this.promptService.handleResponse('requestsConfig.configureSuccessfully')),
        catchError(() => of({})),
        startWith(null)
      )
    )
  );
  readonly loading$ = this.submitHandler$.pipe(map((value) => !value));

  constructor(
    private readonly fb: FormBuilder,
    private readonly workflowsQuery: WorkflowsQuery,
    private readonly adminRequestsConfigurationService: AdminRequestsConfigurationService,
    private readonly promptService: PromptService
  ) {}

  @Input() set data(data: RequestConfig) {
    const workflow = this.workflowsQuery.getAll().find((workflow) => workflow.id === data.processId);

    this.model = { ...this.model, ...data, workflow };
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
