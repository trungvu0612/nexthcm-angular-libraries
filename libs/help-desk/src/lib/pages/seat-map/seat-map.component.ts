import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, Injector, QueryList, ViewChildren } from '@angular/core';
import { Zone } from '@nexthcm/ui';
import { FormControl } from '@ngneat/reactive-forms';
import { TuiDialogService } from '@taiga-ui/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SeatComponent } from '../../components/seat/seat.component';
import { HelpDeskService } from '../../services/help-desk.service';

@Component({
  selector: 'hcm-seat-map',
  templateUrl: './seat-map.component.html',
  styleUrls: ['./seat-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeatMapComponent {
  @ViewChildren(SeatComponent) seatRefs!: QueryList<SeatComponent>;
  myId = 'e08eb04d-a430-4e03-b017-e46f865e648d';
  ping = -1;
  dragging = false;
  inputSearch = new FormControl();
  seatMap$: Observable<Partial<Zone>> = this.helpDeskService.getMySeatMap().pipe(
    map((zone) => {
      const seatMap = zone;
      seatMap.seats = seatMap.seats?.map((seat) => Object.assign(seat, JSON.parse(seat.style || '')));
      return seatMap;
    })
  );

  constructor(
    private dialogService: TuiDialogService,
    private injector: Injector,
    private helpDeskService: HelpDeskService
  ) {}

  findMySeat(): void {
    // const indexMySeat = this.seatMap$.seats?.findIndex((item) => item.id === this.myId);
    // if (indexMySeat !== undefined) {
    //   this.ping = indexMySeat;
    //   this.seatRefs.toArray()[indexMySeat].elementRef.nativeElement.scrollIntoView({
    //     behavior: 'smooth',
    //     block: 'center',
    //     inline: 'center',
    //   });
    //   setTimeout(() => {
    //     this.ping = -1;
    //     this.changeDetector.detectChanges();
    //   }, 1000);
    // }
  }

  handleDragEnded(event: CdkDragEnd): void {
    event.source._dragRef.reset();
  }

  moveSeat(event: CdkDragStart, index: number): void {
    // this.dragging = true;
    // event.source.moved.pipe(takeUntil(event.source.released), last()).subscribe((data) => {
    //   const halfWidth = this.seatMap$.scaleX / 2;
    //   const halfHeight = this.seatMap$.scaleY / 2;
    //   const parent = data.source.element.nativeElement.parentElement as HTMLElement;
    //   const positionXDrop = this.seatMap$.seats[index].positionX + (data.distance.x / parent.offsetWidth) * 100;
    //   const positionYDrop = this.seatMap$.seats[index].positionY + (data.distance.y / parent.offsetHeight) * 100;
    //
    //   let indexDrop: number | undefined;
    //   this.seatMap$.seats.some((seat, index) => {
    //     if (
    //       positionXDrop > seat.positionX - halfWidth &&
    //       positionXDrop < seat.positionX + halfWidth &&
    //       positionYDrop > seat.positionY - halfHeight &&
    //       positionYDrop < seat.positionY + halfHeight
    //     ) {
    //       indexDrop = index;
    //       return true;
    //     } else return false;
    //   });
    //
    //   if (indexDrop !== undefined) {
    //     const drag = this.seatMap$.seats[index];
    //     const drop = this.seatMap$.seats[indexDrop];
    //     [drag.positionX, drag.positionY, drag.seatNumber, drop.positionX, drop.positionY, drop.seatNumber] = [
    //       drop.positionX,
    //       drop.positionY,
    //       drop.seatNumber,
    //       drag.positionX,
    //       drag.positionY,
    //       drag.seatNumber,
    //     ];
    //   }
    // });
  }

  addSeat(index: number, id?: string): void {
    // if (this.dragging) {
    //   this.dragging = false;
    // } else {
    //   if (id === undefined)
    //     this.dialogService
    //       .open<Partial<Seat> | null>(new PolymorpheusComponent(AddSeatDialogComponent, this.injector), {
    //         size: 's',
    //         closeable: false,
    //       })
    //       .subscribe((seat) => {
    //         if (seat) {
    //           const { positionX, positionY } = this.seatMap$.seats[index];
    //           this.seatMap$.seats[index] = { positionX, positionY, ...seat };
    //         }
    //       });
    // }
  }

  deleteSeat(index: number): void {
    // const { positionX, positionY, seatNumber } = this.seatMap$.seats[index];
    // this.seatMap$.seats[index] = { positionX, positionY, seatNumber };
  }
}
