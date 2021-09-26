import { ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService, Zone } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { BaseComponent } from 'ngx-easy-table';
import { from, of } from 'rxjs';
import { catchError, filter, map, share, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AdminSeatMapsService } from '../../services/admin-seat-maps.service';

@Component({
  selector: 'hcm-seat-map-list',
  templateUrl: './seat-map-list.component.html',
  styleUrls: ['./seat-map-list.component.scss'],
  providers: [RxState, TuiDestroyService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeatMapListComponent extends AbstractServerSortPaginationTableComponent<Zone> {
  @ViewChild('table') table!: BaseComponent;
  readonly columns$ = this.translocoService
    .selectTranslateObject('ZONE_TABLE', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((translate) => [
        { key: 'name', title: translate.name },
        { key: 'office', title: translate.office },
        { key: 'action', title: translate.action, orderEnabled: false },
      ])
    );

  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.adminSeatMapService.getSeatMaps(this.queryParams$.value).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    @Inject(TRANSLOCO_SCOPE) readonly scope: TranslocoScope,
    readonly state: RxState<Pagination<Zone>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    private adminSeatMapService: AdminSeatMapsService,
    private promptService: PromptService,
    private destroy$: TuiDestroyService,
    private readonly translocoService: TranslocoService
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  deleteSeatMap(id: string) {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate('ZONE_TABLE.MESSAGES.deleteSeatMap'),
        showCancelButton: true,
      })
    )
      .pipe(
        filter((result) => result.isConfirmed),
        switchMap(() =>
          this.adminSeatMapService.delete(id).pipe(tap(() => this.queryParams$.next(this.queryParams$.value)))
        ),
        catchError((err) =>
          this.promptService.open({
            icon: 'error',
            html: this.translocoService.translate(`ERRORS.${err.error.message}`),
          })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
