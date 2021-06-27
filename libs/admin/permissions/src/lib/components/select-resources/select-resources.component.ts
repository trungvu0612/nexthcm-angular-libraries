import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { filterBySearch } from '@nexthcm/ui';
import { FormGroup } from '@ngneat/reactive-forms';
import { RxState } from '@rx-angular/state';
import { TuiIdentityMatcher, TuiStringHandler } from '@taiga-ui/cdk';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
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
  @Input() set control(control: FormGroup<PermissionForm>) {
    this.state.set({ action: control.value.action, resourcesForm: control.controls.resource });
  }

  @HostBinding('style.display') display = 'block';
  search$ = new BehaviorSubject('');
  state$ = this.state.select();
  resources$ = combineLatest([this.state.select('resource'), this.search$]).pipe(
    map(([resources, search]) => filterBySearch(resources, search))
  );
  formControl$ = this.state.select('resourcesForm');
  stringify: TuiStringHandler<Resource> = (item) => item.name;
  matcher: TuiIdentityMatcher<Resource> = (item1, item2) => item1.resourceId === item2.resourceId;

  constructor(private adminPermissions: AdminPermissionsService, private state: RxState<PermissionForm>) {
    this.state.connect(
      'resource',
      this.state.select('action').pipe(
        switchMap((action) => this.adminPermissions.getResourcesByAction(action.actionId || '')),
        tap((resource) => (this.display = !resource?.length ? 'none' : 'block'))
      )
    );
  }
}
