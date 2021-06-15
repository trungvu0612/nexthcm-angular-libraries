import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { SeatZone } from '../../models/offices';
import { AdminOfficesService } from '../../services/admin-offices.service';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { RoomDetailDialogComponent } from '../../components/room-detail-dialog/room-detail-dialog.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'hcm-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoomsComponent implements OnInit {
  seatZones: Partial<SeatZone>[] = [];
  columns = ['name', 'adder', 'description', 'office', 'action'];

  constructor(
    private adminOfficesService: AdminOfficesService,
    private dialogService: TuiDialogService,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.getRoomList();
  }

  getRoomList(): void {
    this.adminOfficesService.getSeatZones().subscribe((data) => (this.seatZones = data));
  }

  showDialog(data?: Partial<SeatZone>): Observable<Partial<SeatZone>> {
    return this.dialogService.open<Partial<SeatZone>>(
      new PolymorpheusComponent(RoomDetailDialogComponent, this.injector),
      {
        size: 'page',
        data: data,
      }
    );
  }

  onAdd(): void {
    this.showDialog().subscribe((detail) => {
      if (detail) this.adminOfficesService.addSeatZone(detail).subscribe(() => this.getRoomList());
    });
  }

  onEdit(index: number): void {
    const { name, office } = this.seatZones[index];
    this.showDialog({ name, office, imageUrl: 'https://i.imgur.com/LgjOMhH.png' }).subscribe((detail) => {
      // if (detail)
      //   this.adminOfficesService
      //     .editRoom(Object.assign(this.roomsRequest[index], detail))
      //     .subscribe(() => this.getRoomList());
    });
  }

  onRemove(index: number): void {
    console.log(index);
  }
}
