import { ChangeDetectionStrategy, Component, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { HashMap, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { from, Observable, of, Subject } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  share,
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
export class TenantManagementComponent extends AbstractServerPaginationTableComponent<BaseTenant> implements OnInit {
  @ViewChild('table') table!: BaseComponent;

  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject<HashMap<string>>('TENANT_TABLE')
    .pipe(
      map((result) => [
        { key: 'tenantCode', title: result.tenantCode },
        { key: 'tenantName', title: result.tenantName },
        { key: 'state', title: result.status },
        { key: 'email', title: result.email },
        { key: 'phone', title: result.phone },
        { key: 'website', title: result.website },
        { key: 'functions', title: result.functions },
      ])
    );
  readonly search$ = new Subject<string | null>();
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.adminTenantsService.getTenants(this.queryParams$.value).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(map((value) => !value), catchError(() => of(false)));

  constructor(
    readonly state: RxState<Pagination<BaseTenant>>,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly translocoService: TranslocoService,
    private readonly adminTenantsService: AdminTenantsService,
    private readonly activatedRoute: ActivatedRoute,
    private readonly destroy$: TuiDestroyService,
    private readonly router: Router,
    private readonly promptService: PromptService
  ) {
    super(state);
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
        label: this.translocoService.translate('createTenant'),
        size: 'l',
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => this.router.navigate([res.id, 'edit']));
  }

  onRemoveTenant(id: string): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate('removeTenant'),
        showCancelButton: true,
      })
    )
      .pipe(
        filter((result) => result.isConfirmed),
        switchMap(() => this.adminTenantsService.removeTenant(id)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('removeTenantSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }
}
