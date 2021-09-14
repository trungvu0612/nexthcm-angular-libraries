import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import { loadWorkflows, PromptService, WorkflowsQuery } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { RxState, toDictionary } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { filter, map, share, startWith, takeUntil } from 'rxjs/operators';
import { AdminRequestsConfigurationService } from './admin-requests-configuration.service';
import { RequestType } from './enums/request-type';
import { RequestConfig } from './request-config';

interface Section {
  type: RequestType;
  label: string;
  open: boolean;
}

type ComponentState = {
  [p in RequestType]: RequestConfig;
};

@Component({
  selector: 'hcm-admin-requests-configuration',
  templateUrl: './admin-requests-configuration.component.html',
  styleUrls: ['./admin-requests-configuration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class AdminRequestsConfigurationComponent {
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
        matcherBy: 'processId',
        required: true,
      },
    },
  ];
  sections: Section[] = [
    { type: RequestType.WorkingAfterHours, label: 'workingAfterHours', open: false },
    { type: RequestType.UpdateTimesheet, label: 'updateTimesheet', open: false },
    { type: RequestType.WorkingOutside, label: 'workingOutside', open: false },
    { type: RequestType.WorkFromHome, label: 'workFromHome', open: false },
  ];
  private request$ = this.adminRequestsConfigurationService.getRequestsConfig().pipe(
    map((configs) => toDictionary(configs, 'type')),
    startWith(null),
    share()
  );
  readonly loading$ = this.request$.pipe(map((value) => !value));

  constructor(
    private readonly actions: Actions,
    private readonly fb: FormBuilder,
    private readonly workflowsQuery: WorkflowsQuery,
    private readonly adminRequestsConfigurationService: AdminRequestsConfigurationService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly state: RxState<ComponentState>
  ) {
    this.actions.dispatch(loadWorkflows());
    this.state.connect(this.request$.pipe(filter(isPresent)));
  }

  onOpenChange(type: RequestType, open: boolean): void {
    if (open) {
      this.form.reset();
      this.model = { ...this.state.get(type) };
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.adminRequestsConfigurationService
        .updateRequestConfig(this.form.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe(this.promptService.handleResponse('configSuccessfully'));
    }
  }

  onCancel(index: number): void {
    this.sections[index].open = false;
  }
}
