import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { filterBySearch } from '@nexthcm/ui';
import { FormGroup } from '@ngneat/reactive-forms';
import { RxState } from '@rx-angular/state';
import { TuiStringHandler } from '@taiga-ui/cdk';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { PermissionForm, Resource } from '../../models/policy';
import { AdminPermissionsService } from '../../services/admin-permissions.service';

@Component({
  selector: 'hcm-select-resources',
  templateUrl: './select-resources.component.html',
  styleUrls: ['./select-resources.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class SelectResourcesComponent {
  search$ = new BehaviorSubject('');
  action$ = this.state.select('action');
  resources$ = combineLatest([this.state.select('resources'), this.search$]).pipe(
    map(([resources, search]) => filterBySearch(resources, search))
  );
  formControl$ = this.state.select('resourcesForm');

  constructor(private adminPermissions: AdminPermissionsService, private state: RxState<PermissionForm>) {
    this.state.connect(
      'resources',
      this.state
        .select('action')
        .pipe(switchMap((action) => this.adminPermissions.getResourcesByAction(action.actionId)))
    );
  }

  @Input() set control(control: FormGroup<PermissionForm>) {
    this.state.set({ action: control.value.action, resourcesForm: control.controls.resources });
  }

  stringify: TuiStringHandler<Resource> = (item) => item.name;
}
