import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Injector } from '@angular/core';
import { ActivatedRoute, Params, UrlSerializer } from '@angular/router';
import {
  AbstractServerSortPaginationTableComponent,
  CommonStatus,
  Office,
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
import { EMPTY, from, iif, Observable, of, share, Subject } from 'rxjs';
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

import { UpsertOfficeDialogComponent } from '../../components/upsert-office-dialog/upsert-office-dialog.component';
import { AdminOfficesService } from '../../services/admin-offices.service';

@Component({
  selector: 'hcm-office-management',
  templateUrl: './office-management.component.html',
  styleUrls: ['./office-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class OfficeManagementComponent extends AbstractServerSortPaginationTableComponent<Office> {
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_OFFICES_COLUMNS', {}, this.translocoScope.scope)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'address', title: result.address },
        { key: 'description', title: result.description },
        { key: 'onsite', title: 'Onsite', cssClass: { name: 'text-center', includeHeader: true } },
        { key: 'status', title: result.status },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );
  readonly CommonStatus = CommonStatus;
  readonly search$ = new Subject<string | null>();
  private readonly request$ = this.fetch$.pipe(
    switchMap(() => this.officesService.getOffices(this.queryParams).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    override readonly state: RxState<Pagination<Office>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    private readonly officesService: OfficesService,
    private readonly adminOfficesService: AdminOfficesService,
    private readonly translocoService: TranslocoService,
    private readonly dialogService: TuiDialogService,
    private readonly promptService: PromptService,
    private readonly destroy$: TuiDestroyService,
    private readonly injector: Injector
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

  override parseParams(params: Params): void {
    super.parseParams(params);
    this.queryParams =
      params['search'] && params['search'] !== 'null'
        ? this.queryParams.set('search', params['search'])
        : this.queryParams.delete('search');
  }

  onUpsertOffice(data?: Office): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(UpsertOfficeDialogComponent, this.injector), {
        label: this.translocoService.translate(`${this.translocoScope.scope}.${data ? 'editOffice' : 'createOffice'}`),
        size: 'l',
        data,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.fetch$.next());
  }

  onRemoveOffice(office: Office): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate(`${this.translocoScope.scope}.deleteOffice`),
        showCancelButton: true,
      })
    )
      .pipe(
        switchMap((result) => iif(() => result.isConfirmed, this.adminOfficesService.deleteOffice(office), EMPTY)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse(`${this.translocoScope.scope}.deleteOfficeSuccessfully`, () =>
          this.fetch$.next()
        )
      );
  }
}
