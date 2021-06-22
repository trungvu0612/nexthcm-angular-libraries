import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { Zone } from '@nexthcm/ui';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Observable, Subject } from 'rxjs';
import { SeatMapDialogComponent } from '../../components/seat-map-dialog/seat-map-dialog.component';
import { AdminOfficesService } from '../../services/admin-offices.service';

@Component({
  selector: 'hcm-seat-maps',
  templateUrl: './seat-maps.component.html',
  styleUrls: ['./seat-maps.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeatMapsComponent {
  refresh$ = new Subject();

  constructor(
    private adminOfficesService: AdminOfficesService,
    private dialogService: TuiDialogService,
    private injector: Injector
  ) {}

  showDialog(data?: Partial<Zone>): Observable<Partial<Zone>> {
    return this.dialogService.open<Partial<Zone>>(new PolymorpheusComponent(SeatMapDialogComponent, this.injector), {
      size: 'page',
      data: data,
    });
  }

  onAdd(): void {
    this.showDialog().subscribe((seatZone) => {
      if (seatZone) this.adminOfficesService.addSeatZone(seatZone).subscribe(() => this.refresh$.next());
    });
  }

  onEdit(item: Partial<Zone>): void {
    this.showDialog(item).subscribe((seatZone) => {
      if (seatZone) this.adminOfficesService.editSeatZone(seatZone).subscribe(() => this.refresh$.next());
    });
  }

  onRemove(item: Partial<Zone>): void {
    console.log(item);
  }
}
