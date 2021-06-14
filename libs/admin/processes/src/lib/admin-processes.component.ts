import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { map } from 'rxjs/operators';
import { ProcessesService } from './services/processes.service';
import { GLOBAL_STATUS_TYPES_RX_STATE, GlobalStatusTypesState } from './state/status-types';

@Component({
  selector: 'hcm-admin-processes',
  template: '<router-outlet></router-outlet>',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminProcessesComponent {
  constructor(
    @Inject(GLOBAL_STATUS_TYPES_RX_STATE) private state: RxState<GlobalStatusTypesState>,
    private processesService: ProcessesService
  ) {
    this.state.connect('statusTypes', this.processesService.getStatusTypes().pipe(map((res) => res.data.items)));
  }
}
