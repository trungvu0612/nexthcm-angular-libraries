import { ChangeDetectionStrategy, Component } from '@angular/core';
import { filterBySearch } from '@nexthcm/ui';
import { FormControl } from '@ngneat/reactive-forms';
import { FieldType } from '@ngx-formly/core';
import { RxState } from '@rx-angular/state';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Service } from '../../models/policy';
import { AdminPermissionsService } from '../../services/admin-permissions.service';

@Component({
  selector: 'formly-input-service',
  templateUrl: './input-service.type.html',
  // styles: [':host {display: flex; padding: 1.75rem;}'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class InputServiceComponent extends FieldType {
  expanded = false;
  searchControl = new FormControl<string>('');
  servicesFiltered$ = this.state.select('services');

  constructor(
    private adminPermissions: AdminPermissionsService,
    private state: RxState<{ services: Partial<Service>[] }>
  ) {
    super();
    this.state.connect(
      'services',
      this.searchControl.valueChanges.pipe(
        startWith(''),
        switchMap((search) =>
          this.adminPermissions.select('services').pipe(
            map((services) => Array(12).fill(services[0])),
            map((services) => filterBySearch(services, search))
          )
        )
      )
    );
  }

  chooseService(service: Partial<Service>): void {
    this.formControl.patchValue(service);
    this.toggleExpanded();
  }

  toggleExpanded(): void {
    this.expanded = !this.expanded;
  }
}
