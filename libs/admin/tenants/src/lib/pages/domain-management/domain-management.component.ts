import { Location } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, CommonStatus, Pagination, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Columns } from 'ngx-easy-table';
import { from, Observable, of, share, Subject } from 'rxjs';
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
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('TABLE_COLUMNS', {}, this.translocoScope.scope)
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
  override queryParams = new HttpParams()
    .set('page', 0)
    .set('size', 10)
    .set('tenantId', this.tenantId || '');
  private readonly request$ = this.fetch$.pipe(
    switchMap(() => this.adminTenantsService.getTenantDomains(this.queryParams).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );

  constructor(
    override readonly state: RxState<Pagination<TenantDomain>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
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

  get tenantId(): string {
    return this.activatedRoute.snapshot.params['tenantId'] || '';
  }

  onUpsertDomain(data?: TenantDomain): void {
    this.dialogService
      .open(new PolymorpheusComponent(UpsertTenantDomainDialogComponent, this.injector), {
        label: this.translocoService.translate(data ? 'tenants.editDomain' : 'tenants.addDomain'),
        data,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.fetch$.next());
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
      .subscribe(this.promptService.handleResponse('tenants.removeDomainSuccessfully', () => this.fetch$.next()));
  }
}
