import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PromptService, WorkflowsQuery } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { takeUntil } from 'rxjs/operators';
import { AdminRequestsConfigurationService } from '../../admin-requests-configuration.service';
import { RequestConfig } from '../../request-config';

@Component({
  selector: 'hcm-request-config-form',
  templateUrl: './request-config-form.component.html',
  styleUrls: ['./request-config-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class RequestConfigFormComponent {
  @Output() cancel = new EventEmitter();

  form = this.fb.group<RequestConfig>({} as RequestConfig);
  model = {} as RequestConfig;
  fields: FormlyFieldConfig[] = [
    { key: 'type', templateOptions: { required: true } },
    {
      key: 'processId',
      type: 'select',
      templateOptions: {
        translate: true,
        label: 'workflow',
        labelClassName: 'font-semibold',
        placeholder: 'chooseWorkflow',
        options: this.workflowsQuery.selectAll(),
        labelProp: 'name',
        valueProp: 'processId',
        required: true,
      },
    },
  ];

  constructor(
    private readonly fb: FormBuilder,
    private readonly workflowsQuery: WorkflowsQuery,
    private readonly adminRequestsConfigurationService: AdminRequestsConfigurationService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService
  ) {}

  @Input()
  set data(data: RequestConfig) {
    this.model = { ...this.model, ...data };
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formModel = { ...this.form.value };
      this.adminRequestsConfigurationService
        .updateRequestConfig(formModel)
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.promptService.handleResponse('configSuccessfully'));
    }
  }
}
