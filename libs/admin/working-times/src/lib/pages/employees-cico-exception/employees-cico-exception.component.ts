import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import {
  AbstractServerPaginationTableComponent,
  CommonStatus,
  EmployeeInfo,
  Pagination,
  PromptService,
} from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { Columns } from 'ngx-easy-table';
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

import { WorkingTimesService } from '../../services/working-times.service';

@Component({
  selector: 'hcm-employees-cico-exception',
  templateUrl: './employees-cico-exception.component.html',
  styleUrls: ['./employees-cico-exception.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class EmployeesCICOExceptionComponent extends AbstractServerPaginationTableComponent<EmployeeInfo> {
  readonly CommonStatus = CommonStatus;
  readonly columns$: Observable<Columns[]> = this.translocoService
    .selectTranslateObject('ADMIN_EXCLUSION_COLUMNS', {}, this.translocoScope.scope)
    .pipe(
      map((result) => [
        { key: 'cif', title: 'CIF' },
        { key: 'fullName', title: result.fullName },
        { key: 'status', title: result.status },
        {
          key: 'isSkipCheckInOutNormal',
          title: result.excepted,
          cssClass: { name: 'text-center', includeHeader: true },
        },
      ])
    );
  readonly search$ = new Subject<string | null>();

  private readonly request$ = this.fetch$.pipe(
    switchMap(() => this.workingTimesService.getCICOExclusionEmployees(this.queryParams).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );

  constructor(
    override readonly state: RxState<Pagination<EmployeeInfo>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private readonly workingTimesService: WorkingTimesService,
    private readonly destroy$: TuiDestroyService,
    private readonly translocoService: TranslocoService,
    private readonly promptService: PromptService
  ) {
    super(state);
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

  confirmationDialog(employeeId: string, isSkipCheckInOutNormal: boolean): void {
    const payload = { isSkipCheckInOutNormal };

    from(
      this.promptService.open({
        icon: 'info',
        html: this.translocoService.translate(`${this.translocoScope.scope}.contentConfirmation`),
        showCancelButton: true,
      })
    )
      .pipe(
        tap((result) => {
          if (!result.isConfirmed) this.fetch$.next();
        }),
        filter((result) => result.isConfirmed),
        switchMap(() => this.workingTimesService.updateCICOExclusionEmployee(employeeId, payload)),
        catchError((err) =>
          from(
            this.promptService
              .open({ icon: 'error', html: this.promptService.generateErrorMessage(err) })
              .then(() => this.fetch$.next())
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse(`${this.translocoScope.scope}.submitRequestSuccessfully`, () =>
          this.fetch$.next()
        )
      );
  }
}
