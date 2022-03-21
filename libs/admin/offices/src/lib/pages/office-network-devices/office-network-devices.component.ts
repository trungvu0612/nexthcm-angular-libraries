import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import {
  AbstractServerPaginationTableComponent,
  CommonStatus,
  OfficesService,
  Pagination,
  PromptService,
} from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Columns } from 'ngx-easy-table';
import { EMPTY, from, iif, Observable, of, share } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { UpsertWifiDeviceComponent } from '../../components/upsert-wifi-device/upsert-wifi-device.component';
import { WifiDevice } from '../../models/wifi-device';
import { AdminOfficesService } from '../../services/admin-offices.service';

@Component({
  selector: 'hcm-office-network-devices',
  templateUrl: './office-network-devices.component.html',
  styleUrls: ['./office-network-devices.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class OfficeNetworkDevicesComponent extends AbstractServerPaginationTableComponent<WifiDevice> {
  readonly officeId$ = this.activatedRoute.paramMap.pipe(
    map((map) => map.get('officeId')),
    filter(isPresent),
    shareReplay(1)
  );
  readonly officeName$ = this.officeId$.pipe(
    switchMap((officeId) => this.officesService.doGetOffices(officeId)),
    map((office) => office?.name)
  );
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_OFFICES_COLUMNS', {}, this.translocoScope.scope)
    .pipe(
      map((result) => [
        { key: 'wifiSSID', title: 'SSID' },
        { key: 'macAddress', title: result.MACAddress },
        { key: 'description', title: result.description },
        { key: 'status', title: result.status },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );
  readonly CommonStatus = CommonStatus;
  private readonly request$ = this.fetch$.pipe(
    switchMap(() => this.officeId$),
    switchMap((officeId) =>
      this.adminOfficesService.getNetworkDevicesByOfficeId(officeId, this.queryParams).pipe(startWith(null))
    ),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    override readonly state: RxState<Pagination<WifiDevice>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    private readonly adminOfficesService: AdminOfficesService,
    private readonly officesService: OfficesService,
    private readonly translocoService: TranslocoService,
    private readonly dialogService: TuiDialogService,
    private readonly promptService: PromptService,
    private readonly destroy$: TuiDestroyService,
    private readonly injector: Injector
  ) {
    super(state);
    state.connect(this.request$.pipe(filter(isPresent)));
    officesService.doLoadOffices();
  }

  onUpsertWifiDevice(deviceData?: WifiDevice): void {
    this.officeId$
      .pipe(
        map((officeId) =>
          deviceData ? { ...deviceData, officeId } : ({ officeId, state: CommonStatus.active } as WifiDevice)
        )
      )
      .pipe(
        switchMap((data) =>
          this.dialogService.open<boolean>(new PolymorpheusComponent(UpsertWifiDeviceComponent, this.injector), {
            label: this.translocoService.translate(
              `${this.translocoScope.scope}.${deviceData ? 'editWifiDevice' : 'addWifiDevice'}`
            ),
            size: 'l',
            data,
          })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.fetch$.next());
  }

  onRemoveWifiDevice(deviceId: string): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate(`${this.translocoScope.scope}.deleteWifiDevice`),
        showCancelButton: true,
      })
    )
      .pipe(
        switchMap((result) =>
          iif(() => result.isConfirmed, this.adminOfficesService.deleteNetworkDevice(deviceId), EMPTY)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse(`${this.translocoScope.scope}.deleteWifiDeviceSuccessfully`, () =>
          this.fetch$.next()
        )
      );
  }
}
