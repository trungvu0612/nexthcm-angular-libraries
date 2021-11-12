import { ChangeDetectionStrategy, Component, Inject, Injector, OnInit, ViewChild } from '@angular/core';
import { CommonStatus, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService, TuiNotificationsService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { API, BaseComponent, Columns, Config, DefaultConfig } from 'ngx-easy-table';
import { Observable, of, Subject } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { EditSynchronizationSettingDialogComponent } from '../../components/edit-synchronization-setting-dialog/edit-synchronization-setting-dialog.component';
import { SyncType } from '../../enums';
import { SynchronizationSetting } from '../../models/synchronization-setting';
import { SynchronizeDataService } from '../../services/synchronize-data.service';

interface CommonState {
  data: SynchronizationSetting[];
}

@Component({
  selector: 'hcm-synchronization-settings',
  templateUrl: './synchronization-settings.component.html',
  styleUrls: ['./synchronization-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService, RxState],
})
export class SynchronizationSettingsComponent implements OnInit {
  @ViewChild('table', { static: true }) table!: BaseComponent;

  configuration: Config = {
    ...DefaultConfig,
    paginationEnabled: false,
    paginationRangeEnabled: false,
    fixedColumnWidth: false,
    orderEnabled: false,
  };
  readonly CommonStatus = CommonStatus;
  readonly SyncType = SyncType;
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_SYNCHRONIZATION_SETTINGS_COLUMNS', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'description', title: result.description },
        { key: 'type', title: result.type },
        { key: 'value', title: result.value },
        { key: 'status', title: result.status },
        { key: '', title: result.functions },
      ])
    );
  readonly data$ = this.state.select('data');
  private readonly refresh$ = new Subject<void>();
  private readonly request$ = this.refresh$.pipe(
    switchMap(() => this.synchronizeDataService.getSynchronizationSettings().pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    private readonly translocoService: TranslocoService,
    private readonly synchronizeDataService: SynchronizeDataService,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly notificationsService: TuiNotificationsService,
    private readonly state: RxState<CommonState>
  ) {
    state.connect(
      'data',
      this.request$.pipe(
        filter(isPresent),
        tap((data) => {
          this.table.apiEvent({ type: API.setPaginationDisplayLimit, value: data.length });
        })
      )
    );
  }

  readonly item = (item: SynchronizationSetting) => item;

  ngOnInit(): void {
    this.refresh$.next();
  }

  onEditSynchronizationSetting(data: SynchronizationSetting): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(EditSynchronizationSettingDialogComponent, this.injector), {
        label: this.translocoService.translate('SCHEDULER.editSynchronizationSetting'),
        size: 'l',
        data,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.refresh$.next());
  }

  onSync(id: string): void {
    this.synchronizeDataService
      .synchronizeManually(id)
      .pipe(
        tap(this.promptService.handleResponse('')),
        switchMap(() =>
          this.notificationsService.show('', { label: this.translocoService.translate('SCHEDULER.startSyncing') })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
