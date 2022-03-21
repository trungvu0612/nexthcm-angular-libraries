import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Injector, OnInit } from '@angular/core';
import { ActivatedRoute, Router, UrlSerializer } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, CommonStatus, Pagination, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Columns } from 'ngx-easy-table';
import { BehaviorSubject, from, Observable, of, share, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

import { UpsertTenantDialogComponent } from '../../components/upsert-tenant-dialog/upsert-tenant-dialog.component';
import { BaseTenant, Tenant } from '../../models/tenant';
import { AdminTenantsService } from '../../services/admin-tenants.service';

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
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('TABLE_COLUMNS', {}, this.translocoScope.scope)
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
  private readonly request$ = this.fetch$.pipe(
    switchMap(() => this.adminTenantsService.getTenants(this.queryParams).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );

  constructor(
    override readonly state: RxState<Pagination<BaseTenant>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private readonly router: Router,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly translocoService: TranslocoService,
    private readonly adminTenantsService: AdminTenantsService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService
  ) {
    super(state, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
    state.hold(
      this.search$.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((searchQuery) => {
          this.resetPage();
          if (searchQuery) {
            this.queryParams = this.queryParams.set('search', searchQuery);
          } else {
            this.setQueryParams('search', null);
            this.queryParams = this.queryParams.delete('search');
          }
          this.fetch$.next();
        })
      )
    );
  }

  ngOnInit(): void {
    const searchParam = this.activatedRoute.snapshot.queryParams['search'];

    if (searchParam) {
      this.search$.next(searchParam);
    }
  }

  createTenant(): void {
    this.dialogService
      .open<Tenant>(new PolymorpheusComponent(UpsertTenantDialogComponent, this.injector), {
        label: this.translocoService.translate(`${this.translocoScope.scope}.createTenant`),
        size: 'l',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => this.router.navigate([res.id], { relativeTo: this.activatedRoute }));
  }

  onRemoveTenant(id: string): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate(`${this.translocoScope.scope}.removeTenant`),
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
        this.promptService.handleResponse(`${this.translocoScope.scope}.removeTenantSuccessfully`, () =>
          this.fetch$.next()
        )
      );
  }
}
