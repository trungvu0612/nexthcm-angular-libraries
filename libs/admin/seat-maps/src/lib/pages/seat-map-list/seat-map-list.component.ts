import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DefaultConfig } from 'ngx-easy-table';
import { map, switchMap } from 'rxjs/operators';
import { TranslocoService } from '@ngneat/transloco';
import { AdminSeatMapsService } from '../../services/admin-seat-maps.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'hcm-seat-map-list',
  templateUrl: './seat-map-list.component.html',
  styleUrls: ['./seat-map-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeatMapListComponent {
  readonly configuration = { ...DefaultConfig, paginationEnabled: false, fixedColumnWidth: false };
  readonly columns$ = this.translocoService.selectTranslateObject('ZONE_TABLE').pipe(
    map((translate) => [
      { key: 'name', title: translate.name },
      { key: 'office', title: translate.office },
      { key: 'action', title: translate.action },
    ])
  );
  readonly params$ = new BehaviorSubject<{ [key: string]: number }>({ size: 10 });
  readonly data$ = this.params$.pipe(switchMap((params) => this.adminSeatMapService.getSeatMaps(params)));

  constructor(
    private readonly adminSeatMapService: AdminSeatMapsService,
    private readonly translocoService: TranslocoService
  ) {}

  deleteSeatMap(id: string) {
    console.log(id);
  }

  changePagination(key: 'page' | 'size', value: number): void {
    this.params$.next({ ...this.params$.value, [key]: value });
  }
}
