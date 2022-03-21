import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { ActivatedRoute, UrlSerializer } from '@angular/router';
import { AbstractServerSortPaginationTableComponent, Pagination, PromptService, SeatMap } from '@nexthcm/cdk';
import { ProviderScope, TRANSLOCO_SCOPE, TranslocoService } from '@ngneat/transloco';
import { RxState } from '@rx-angular/state';
import { isPresent, TuiDestroyService } from '@taiga-ui/cdk';
import { EMPTY, from, iif, of, share } from 'rxjs';
import { catchError, filter, map, startWith, switchMap, takeUntil } from 'rxjs/operators';

import { AdminSeatMapsService } from '../../services/admin-seat-maps.service';

@Component({
  selector: 'hcm-seat-map-management',
  templateUrl: './seat-map-management.component.html',
  styleUrls: ['./seat-map-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [RxState, TuiDestroyService],
})
export class SeatMapManagementComponent extends AbstractServerSortPaginationTableComponent<SeatMap> {
  readonly columns$ = this.translocoService
    .selectTranslateObject('ADMIN_SEAT_MAPS_COLUMNS', {}, this.translocoScope.scope)
    .pipe(
      map((result) => [
        { key: 'name', title: result.name },
        { key: 'office', title: result.office },
        { key: '', title: result.functions, orderEnabled: false },
      ])
    );

  private readonly request$ = this.fetch$.pipe(
    switchMap(() => this.adminSeatMapService.getSeatMaps(this.queryParams).pipe(startWith(null))),
    share()
  );
  readonly loading$ = this.request$.pipe(
    map((value) => !value),
    startWith(true),
    catchError(() => of(false))
  );

  constructor(
    override readonly state: RxState<Pagination<SeatMap>>,
    override readonly activatedRoute: ActivatedRoute,
    readonly locationRef: Location,
    readonly urlSerializer: UrlSerializer,
    @Inject(TRANSLOCO_SCOPE) readonly translocoScope: ProviderScope,
    private readonly adminSeatMapService: AdminSeatMapsService,
    private readonly promptService: PromptService,
    private readonly destroy$: TuiDestroyService,
    private readonly translocoService: TranslocoService
  ) {
    super(state, activatedRoute);
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
        switchMap((result) => iif(() => result.isConfirmed, this.adminSeatMapService.delete(id), EMPTY)),
        takeUntil(this.destroy$)
      )
      .subscribe(
        this.promptService.handleResponse('adminSeatMaps.deleteSeatMapSuccessfully', () => this.fetch$.next())
      );
  }
}
