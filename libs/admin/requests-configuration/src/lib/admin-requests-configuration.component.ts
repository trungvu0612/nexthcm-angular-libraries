import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { PromptService } from '@nexthcm/cdk';
import { toDictionary } from '@rx-angular/cdk/transformations';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { of, share } from 'rxjs';
import { catchError, filter, map, startWith } from 'rxjs/operators';

import { AdminRequestsConfigurationService } from './admin-requests-configuration.service';
import { RequestType } from './enums/request-type';
import { RequestConfig } from './models/request-config';

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
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );

  constructor(
    private readonly fb: UntypedFormBuilder,
    private readonly adminRequestsConfigurationService: AdminRequestsConfigurationService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly state: RxState<ComponentState>
  ) {
    this.state.connect(this.request$.pipe(filter(isPresent)));
  }
}
