import { ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService } from '@nexthcm/cdk';
import { SeatMap } from '@nexthcm/seat-maps';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoScope, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { BaseComponent } from 'ngx-easy-table';
import { from, iif, of } from 'rxjs';
import { catchError, filter, map, shareReplay, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { AdminSeatMapsService } from '../../services/admin-seat-maps.service';

@Component({
  selector: 'hcm-seat-map-management',
  templateUrl: './seat-map-management.component.html',
  styleUrls: ['./seat-map-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class SeatMapManagementComponent extends AbstractServerSortPaginationTableComponent<SeatMap> {
  @ViewChild('table') table!: BaseComponent;

  readonly columns$ = this.translocoService
    .selectTranslateObject('ADMIN_SEAT_MAPS_COLUMNS', {}, (this.scope as ProviderScope).scope)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'office', title: result.office },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );

  private readonly request$ = this.queryParams$.pipe(
    switchMap(() => this.adminSeatMapService.getSeatMaps(this.queryParams$.value).pipe(startWith(null))),
    shareReplay(1)
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    catchError(() => of(false))
  );

  constructor(
    readonly state: RxState<Pagination<SeatMap>>,
    readonly router: Router,
    readonly activatedRoute: ActivatedRoute,
    @Inject(TRANSLOCO_SCOPE) private readonly scope: TranslocoScope,
    private readonly adminSeatMapService: AdminSeatMapsService,
    private readonly promptService: PromptService,
    private readonly destroy$: TuiDestroyService,
    private readonly translocoService: TranslocoService
  ) {
    super(state, router, activatedRoute);
    state.connect(this.request$.pipe(filter(isPresent)));
  }

  deleteSeatMap(id: string): void {
    from(
      this.promptService.open({
        icon: 'question',
        html: this.translocoService.translate('adminSeatMaps.deleteSeatMap'),
        showCancelButton: true,
      })
    )
      .pipe(
        switchMap((result) => iif(() => result.isConfirmed, this.adminSeatMapService.delete(id))),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('adminSeatMaps.deleteSeatMapSuccessfully', () =>
          this.queryParams$.next(this.queryParams$.value)
        )
      );
  }
}
