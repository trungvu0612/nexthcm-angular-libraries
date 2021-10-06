import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, Injector, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterQuery } from '@datorama/akita-ng-router-store';
import { AbstractServerSortPaginationTableComponent, CommonStatus, Pagination, PromptService } from '@nexthcm/cdk';
import { HashMap, ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
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
import { UpsertTenantDomainDialogComponent } from '../../components/upsert-tenant-domain-dialog/upsert-tenant-domain-dialog.component';
import { TenantDomain } from '../../models/tenant';
import { AdminTenantsService } from '../../services/admin-tenants.service';

@Component({
  selector: 'hcm-domain-management',
  templateUrl: './domain-management.component.html',
  styleUrls: ['./domain-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class DomainManagementComponent extends AbstractServerSortPaginationTableComponent<TenantDomain> {
  @ViewChild('table') table!: BaseComponent;

  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject<HashMap<string>>('TABLE_COLUMNS', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'domain', title: result.domain },
        { key: 'status', title: result.status },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );
  readonly CommonStatus = CommonStatus;
  readonly search$ = new Subject<string | null>();
  readonly queryParams$ = new BehaviorSubject(
    new HttpParams()
      .set('page', 0)
      .set('size', 10)
      .set('tenantId', this.routerQuery.getParams('tenantId') || '')
  );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.adminTenantsService.getTenantDomains(this.queryParams$.value).pipe(startWith(null))),
    shareReplay(1)
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    readonly state: RxState<Pagination<TenantDomain>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly translocoService: TranslocoService,
    private readonly adminTenantsService: AdminTenantsService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly routerQuery: RouterQuery
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

  onUpsertDomain(data?: TenantDomain): void {
    this.dialogService
      .open(new PolymorpheusComponent(UpsertTenantDomainDialogComponent, this.injector), {
        label: this.translocoService.translate(data ? 'tenants.editDomain' : 'tenants.addDomain'),
        data,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.queryParams$.next(this.queryParams$.value));
  }

  onRemoveTenantDomain(id: string): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate('tenants.removeDomain'),
        showCancelButton: true,
      })
    )
      .pipe(
        filter((result) => result.isConfirmed),
        switchMap(() => this.adminTenantsService.removeTenantDomain(id)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('tenants.removeDomainSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }
}
