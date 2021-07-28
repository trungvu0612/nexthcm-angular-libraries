import { ChangeDetectionStrategy, Component } from '@angular/core';
import { filterBySearch, PromptService } from '@nexthcm/ui';
import { FormControl } from '@ngneat/reactive-forms';
import { TranslocoService } from '@ngneat/transloco';
import { DefaultConfig } from 'ngx-easy-table';
import { BehaviorSubject, combineLatest, from, iif } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
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
  readonly configuration = { ...DefaultConfig, paginationEnabled: false, fixedColumnWidth: false };
  readonly columns$ = this.translocoService.selectTranslateObject('TENANT_TABLE').pipe(
    map((translate) => [
      { key: 'ordinalNumber', title: translate.ordinalNumber },
      { key: 'companyName', title: translate.companyName },
      { key: 'companyCode', title: translate.companyCode },
      { key: 'status', title: translate.status },
      { key: 'action', title: translate.action },
    ])
  );
  readonly params$ = new BehaviorSubject<{ [key: string]: number }>({ size: 10 });
  readonly data$ = combineLatest([
    this.params$.pipe(switchMap((params) => this.adminTenantService.getTenants(params))),
    this.searchControl.valueChanges.pipe(startWith('')),
  ]).pipe(
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

  constructor(
    private readonly adminTenantService: AdminTenantService,
    private readonly translocoService: TranslocoService,
    private promptService: PromptService
  ) {}

  deleteTenant(id: string) {
    from(this.promptService.open({ icon: 'warning', showCancelButton: true } as SweetAlertOptions))
      .pipe(
        switchMap((result) => iif(() => result.isConfirmed, this.adminTenantService.deleteTenant(id))),
        switchMap(() => this.promptService.open({ icon: 'success' } as SweetAlertOptions))
      )
      .subscribe(() => this.params$.next(this.params$.value));
  }

  setTenantId(id: string) {
    this.adminTenantService.set({ id });
  }

  changePagination(key: 'page' | 'size', value: number): void {
    this.params$.next({ ...this.params$.value, [key]: value });
  }
}
