import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { AbstractServerPaginationTableComponent, Pagination, PromptService, Zone } from '@nexthcm/cdk';
import { TranslocoService } from '@ngneat/transloco';
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
export class SeatMapListComponent extends AbstractServerPaginationTableComponent<Zone> {
  @ViewChild('table') table!: BaseComponent;
  readonly columns$ = this.translocoService.selectTranslateObject('ZONE_TABLE').pipe(
    map((translate) => [
      { key: 'name', title: translate.name },
      { key: 'office', title: translate.office },
      { key: 'action', title: translate.action },
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
    readonly state: RxState<Pagination<Zone>>,
    private adminSeatMapService: AdminSeatMapsService,
    private promptService: PromptService,
    private destroy$: TuiDestroyService,
    private readonly translocoService: TranslocoService
  ) {
    super(state);
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
