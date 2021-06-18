import { ChangeDetectionStrategy, Component, Injector } from '@angular/core';
import { Zone } from '@nexthcm/ui';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Observable, Subject } from 'rxjs';
import { RoomDetailDialogComponent } from '../../components/room-detail-dialog/room-detail-dialog.component';
import { AdminOfficesService } from '../../services/admin-offices.service';

@Component({
  selector: 'hcm-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomsComponent {
  refresh$ = new Subject();

  constructor(
    private adminOfficesService: AdminOfficesService,
    private dialogService: TuiDialogService,
    private injector: Injector
  ) {}

  showDialog(data?: Partial<Zone>): Observable<Partial<Zone>> {
    return this.dialogService.open<Partial<Zone>>(new PolymorpheusComponent(RoomDetailDialogComponent, this.injector), {
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
    this.showDialog(item).subscribe();
  }

  onRemove(item: Partial<Zone>): void {
    console.log(item);
  }
}
