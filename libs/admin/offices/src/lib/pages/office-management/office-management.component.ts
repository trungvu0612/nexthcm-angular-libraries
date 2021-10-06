import { ChangeDetectionStrategy, Component, Inject, Injector, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { BaseComponent, Columns } from 'ngx-easy-table';
import { from, iif, Observable, of, Subject } from 'rxjs';
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
import { UpsertOfficeDialogComponent } from '../../components/upsert-office-dialog/upsert-office-dialog.component';
import { Office } from '../../models/office';
import { AdminOfficesService } from '../../services/admin-offices.service';

@Component({
  selector: 'hcm-office-management',
  templateUrl: './office-management.component.html',
  styleUrls: ['./office-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class OfficeManagementComponent extends AbstractServerSortPaginationTableComponent<Office> implements OnInit {
  @ViewChild('table') table!: BaseComponent;

  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_OFFICES_COLUMNS', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'address', title: result.address },
        { key: 'description', title: result.description },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );
  readonly search$ = new Subject<string | null>();
  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.adminOfficesService.getOffices(this.queryParams$.value).pipe(startWith(null))),
    shareReplay(1)
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    readonly state: RxState<Pagination<Office>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
    private readonly adminOfficesService: AdminOfficesService,
    private readonly translocoService: TranslocoService,
    private readonly dialogService: TuiDialogService,
    private readonly promptService: PromptService,
    private readonly destroy$: TuiDestroyService,
    private readonly injector: Injector
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
    state.hold(
      this.search$.pipe(
        filter(isPresent),
        debounceTime(300),
        distinctUntilChanged(),
        tap((searchQuery) => this.queryParams$.next(this.queryParams$.value.set('search', searchQuery)))
      )
    );
  }

  ngOnInit(): void {
    const searchParam = this.activatedRoute.snapshot.queryParams.search;
    if (searchParam) this.search$.next(searchParam);
  }

  onUpsertOffice(data?: Office): void {
    this.dialogService
      .open<boolean>(new PolymorpheusComponent(UpsertOfficeDialogComponent, this.injector), {
        label: this.translocoService.translate(data ? 'offices.editOffice' : 'offices.createOffice'),
        size: 'l',
        data,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.queryParams$.next(this.queryParams$.value));
  }

  onRemoveOffice(id: string): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate('offices.deleteOffice'),
        showCancelButton: true,
      })
    )
      .pipe(
        switchMap((result) => iif(() => result.isConfirmed, this.adminOfficesService.deleteOffice(id))),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('offices.deleteOfficeSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }
}
