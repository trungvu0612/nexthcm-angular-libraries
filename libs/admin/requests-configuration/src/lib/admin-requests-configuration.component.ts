import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Actions } from '@datorama/akita-ng-effects';
import { loadWorkflows, PromptService, WorkflowsQuery } from '@nexthcm/cdk';
import { FormBuilder } from '@ngneat/reactive-forms';
import { RxState, toDictionary } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { filter, map, share, startWith } from 'rxjs/operators';
import { AdminRequestsConfigurationService } from './admin-requests-configuration.service';
import { RequestType } from './enums/request-type';
import { RequestConfig } from './request-config';

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
  readonly RequestType = RequestType;
  readonly state$ = this.state.select();
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
}
