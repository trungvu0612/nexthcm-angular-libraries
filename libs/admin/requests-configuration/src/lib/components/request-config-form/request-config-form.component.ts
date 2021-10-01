import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { PromptService, WorkflowsQuery } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { isPresent } from '@taiga-ui/cdk';
import { Subject } from 'rxjs';
import { filter, map, startWith, switchMap, tap } from 'rxjs/operators';
import { AdminRequestsConfigurationService } from '../../admin-requests-configuration.service';
import { RequestConfig } from '../../request-config';

@Component({
  selector: 'hcm-request-config-form',
  templateUrl: './request-config-form.component.html',
  styleUrls: ['./request-config-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
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
  readonly submit$ = new Subject<RequestConfig>();
  readonly submitHandler$ = this.submit$.pipe(
    switchMap((payload) => this.adminRequestsConfigurationService.updateRequestConfig(payload).pipe(startWith(null)))
  );
  readonly loading$ = this.submitHandler$.pipe(map((value) => !value));

  constructor(
    private readonly fb: FormBuilder,
    private readonly workflowsQuery: WorkflowsQuery,
    private readonly adminRequestsConfigurationService: AdminRequestsConfigurationService,
    private readonly promptService: PromptService,
    state: RxState<Record<string, unknown>>
  ) {
    state.hold(this.submitHandler$.pipe(filter(isPresent), tap(this.promptService.handleResponse())));
  }

  @Input()
  set data(data: RequestConfig) {
    this.model = { ...this.model, ...data };
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.submit$.next({ ...this.form.value });
    }
  }
}
