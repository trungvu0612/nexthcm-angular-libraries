import { ChangeDetectionStrategy, Component } from '@angular/core';
import { filterBySearch } from '@nexthcm/ui';
import { FormControl } from '@ngneat/reactive-forms';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Tenant } from '../../models/tenant';
import { AdminTenantService } from '../../services/admin-tenant.service';

@Component({
  selector: 'hcm-tenant-list',
  templateUrl: './tenant-list.component.html',
  styleUrls: ['./tenant-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TenantListComponent {
  readonly searchControl = new FormControl<string>();
  readonly columns = ['ordinalNumber', 'tenantCode', 'tenantName', 'status', 'action'];
  readonly params$ = new BehaviorSubject<{ [key: string]: number }>({ size: 10 });
  readonly source$ = this.params$.pipe(switchMap((params) => this.adminTenantService.getTenants(params)));
  readonly data$ = combineLatest([this.source$, this.searchControl.valueChanges.pipe(startWith(''))]).pipe(
    map(([data, search]) => ({
      ...data,
      items: filterBySearch<Tenant>(data.items, search, ['tenantCode', 'tenantName']),
    }))
  );
  readonly statistic$ = this.adminTenantService.getTenants({ size: 999 }).pipe(
    map((data) => {
      const getLength = (state: number) => data.items.filter((item) => item.state === state).length;
      return {
        active: getLength(1),
        pending: getLength(0),
        deactivate: getLength(-1),
      };
    })
  );

  constructor(private readonly adminTenantService: AdminTenantService) {}

  changePagination(key: 'page' | 'size', value: number): void {
    this.params$.next({ ...this.params$.value, [key]: value });
  }
}
