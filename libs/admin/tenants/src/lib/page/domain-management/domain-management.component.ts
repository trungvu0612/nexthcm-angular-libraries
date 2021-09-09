import { ChangeDetectionStrategy, Component, Injector, ViewChild } from '@angular/core';
import { AbstractServerPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { HashMap, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { from, Observable } from 'rxjs';
import { filter, map, share, startWith, switchMap, takeUntil } from 'rxjs/operators';
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
export class DomainManagementComponent extends AbstractServerPaginationTableComponent<TenantDomain> {
  @ViewChild('table') table!: BaseComponent;

  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject<HashMap<string>>('TENANT_TABLE')
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'domainUrl', title: result.domainUrl },
        { key: 'status', title: result.status },
        { key: 'functions', title: result.functions },
      ])
    );
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.adminTenantsService.getTenantDomains(this.queryParams$.value).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(map((value) => !value));

  constructor(
    readonly state: RxState<Pagination<TenantDomain>>,
    private readonly dialogService: TuiDialogService,
    private readonly injector: Injector,
    private readonly translocoService: TranslocoService,
    private readonly adminTenantsService: AdminTenantsService,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService
  ) {
    super(state);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  onUpsertDomain(data?: TenantDomain): void {
    this.dialogService
      .open(new PolymorpheusComponent(UpsertTenantDomainDialogComponent, this.injector), {
        label: this.translocoService.translate(data ? 'editDomain' : 'createDomain'),
        data,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.queryParams$.next(this.queryParams$.value));
  }

  onRemoveTenantDomain(id: string): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate('removeDomain'),
        showCancelButton: true,
      })
    )
      .pipe(
        filter((result) => result.isConfirmed),
        switchMap(() => this.adminTenantsService.removeTenantDomain(id)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('removeDomainSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }
}
