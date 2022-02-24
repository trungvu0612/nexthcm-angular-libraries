import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { filterBySearch } from '@nexthcm/cdk';
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
  @HostBinding('style.display') display = 'block';
  search$ = new BehaviorSubject('');
  state$ = this.state.select();
  resources$ = combineLatest([this.state.select('resource'), this.search$]).pipe(
    map(([resources, search]) => filterBySearch<Resource>(resources, search))
  );
  formControl$ = this.state.select('resourcesForm');

  constructor(private adminPermissions: AdminPermissionsService, private state: RxState<PermissionForm>) {
    this.state.connect(
      'resource',
      this.state.select('action').pipe(
        switchMap((action) => this.adminPermissions.getResourcesByAction(action.id as string)),
        tap((resource) => (this.display = !resource?.length ? 'none' : 'block'))
      )
    );
  }

  @Input() set control(control: FormGroup<PermissionForm>) {
    this.state.set({ action: control.value.action, resourcesForm: control.controls.resource });
  }

  stringify: TuiStringHandler<Resource> = (item) => item.name;

  matcher: TuiIdentityMatcher<Resource> = (item1, item2) => item1.id === item2.id;

  update(isSelect = true): void {
    this.state.get('resourcesForm')?.setValue(isSelect ? this.state.get('resource') : []);
  }
}
