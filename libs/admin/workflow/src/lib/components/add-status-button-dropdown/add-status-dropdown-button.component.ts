import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { TuiStringHandler } from '@taiga-ui/cdk';
import { Subject } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { State } from '../../models';
import { AdminWorkflowService } from '../../services/admin-workflow.service';

@Component({
  selector: 'hcm-add-status-dropdown-button',
  templateUrl: './add-status-dropdown-button.component.html',
  styleUrls: ['./add-status-dropdown-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddStatusDropdownButtonComponent {
  readonly search$ = new Subject<string | null>();
  readonly items$ = this.search$.pipe(
    startWith(null),
    switchMap((search) => this.adminWorkflowService.getStatuses(search))
  );
  open = false;
  value: State | null = null;

  constructor(private adminWorkflowService: AdminWorkflowService, private translocoService: TranslocoService) {}

  readonly stringify: TuiStringHandler<any> = (item: State) => item.name;

  onValueChange(value: State): void {
    console.log(value);
    this.value = value;
  }
}
