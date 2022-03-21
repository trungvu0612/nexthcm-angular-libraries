import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AbstractServerPaginationTableComponent, CommonStatus, Pagination } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent } from '@taiga-ui/cdk';
import { Columns } from 'ngx-easy-table';
import { Observable, of, share } from 'rxjs';
import { catchError, filter, map, startWith, switchMap } from 'rxjs/operators';

import { OfficeWifiDevicesInfo } from '../../models/office-wifi-devices-info';
import { AdminOfficesService } from '../../services/admin-offices.service';

@Component({
  selector: 'hcm-wifi-device-management',
  templateUrl: './wifi-device-management.component.html',
  styleUrls: ['./wifi-device-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState],
})
export class WifiDeviceManagement extends AbstractServerPaginationTableComponent<OfficeWifiDevicesInfo> {
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_OFFICES_COLUMNS', {}, this.translocoScope.scope)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        {
          key: 'networkCounter',
          title: result.numberOfDevices,
          cssClass: { name: 'text-center', includeHeader: true },
        },
        { key: 'status', title: result.status },
        { key: '', title: result.functions },
      ])
    );
  readonly CommonStatus = CommonStatus;
  private readonly request$ = this.fetch$.pipe(
    switchMap(() => this.adminOfficesService.getNetworkDevicesOfOfficesInfo(this.queryParams).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    override readonly state: RxState<Pagination<OfficeWifiDevicesInfo>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    private readonly adminOfficesService: AdminOfficesService,
    private readonly translocoService: TranslocoService
  ) {
    super(state);
    state.connect(this.request$.pipe(filter(isPresent)));
  }
}
