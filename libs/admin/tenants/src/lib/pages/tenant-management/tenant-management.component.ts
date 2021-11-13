import { ChangeDetectionStrategy, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, CommonStatus, Pagination, PromptService } from '@nexthcm/cdk';
import { HashMap, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { BehaviorSubject, from, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';
import { UpsertTenantDialogComponent } from '../../components/upsert-tenant-dialog/upsert-tenant-dialog.component';
import { BaseTenant, Tenant } from '../../models/tenant';
import { AdminTenantsService } from '../../services/admin-tenants.service';
import { TRANSLATION_SCOPE } from '../../translation-scope';

@Component({
  selector: 'hcm-tenant-management',
  templateUrl: './tenant-management.component.html',
  styleUrls: ['./tenant-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class TenantManagementComponent
  extends AbstractServerSortPaginationTableComponent<BaseTenant>
  implements OnInit
{
  @ViewChild('table') table!: BaseComponent;

  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject<HashMap<string>>('TABLE_COLUMNS', {}, TRANSLATION_SCOPE)
    .pipe(
      map((result) => [
        { key: 'tenantCode', title: result.tenantCode },
        { key: 'tenantName', title: result.tenantName },
        { key: 'email', title: result.email },
        { key: 'phone', title: result.phone },
        { key: 'website', title: result.website },
        { key: 'state', title: result.status },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );
  readonly CommonStatus = CommonStatus;
  readonly search$ = new Subject<string | null>();
  readonly reloadStatistic$ = new BehaviorSubject(undefined);
  readonly statistic$ = this.reloadStatistic$.pipe(
    switchMap(() => this.adminTenantsService.getStatisticByTenantStatus())
  );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.adminTenantsService.getTenants(this.queryParams$.value).pipe(startWith(null))),
    shareReplay(1)
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    readonly state: RxState<Pagination<BaseTenant>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly translocoService: TranslocoService,
    private readonly adminTenantsService: AdminTenantsService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
    state.hold(
      this.search$.pipe(
        filter(isPresent),
        debounceTime(1000),
        distinctUntilChanged(),
        tap((searchQuery) => this.queryParams$.next(this.queryParams$.value.set('search', searchQuery)))
      )
    );
  }

  ngOnInit(): void {
    const searchParam = this.activatedRoute.snapshot.queryParams.search;

    if (searchParam) {
      this.search$.next(searchParam);
    }
  }

  createTenant(): void {
    this.dialogService
      .open<Tenant>(new PolymorpheusComponent(UpsertTenantDialogComponent, this.injector), {
        label: this.translocoService.translate('tenants.createTenant'),
        size: 'l',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => this.router.navigate([res.id], { relativeTo: this.activatedRoute }));
  }

  onRemoveTenant(id: string): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate('tenants.removeTenant'),
        showCancelButton: true,
      })
    )
      .pipe(
        filter((result) => result.isConfirmed),
        switchMap(() => this.adminTenantsService.removeTenant(id)),
        tap(() => this.reloadStatistic$.next(undefined)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('tenants.removeTenantSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }
}
