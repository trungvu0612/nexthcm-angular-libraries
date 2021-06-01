import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { last, takeUntil } from 'rxjs/operators';
import { AddSeatDialogComponent } from '../../components/add-seat-dialog/add-seat-dialog.component';
import { InitMapDialogComponent } from '../../components/init-map-dialog/init-map-dialog.component';
import { SeatInfo, SeatMap } from '../../models';
import { SeatComponent } from '../../components/seat/seat.component';

@Component({
  selector: 'hcm-seat-map',
  templateUrl: './seat-map.component.html',
  styleUrls: ['./seat-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeatMapComponent {
  @ViewChildren(SeatComponent) seatRefs!: QueryList<SeatComponent>;
  myId = 4;
  ping: number | null = null;
  dragging = false;
  inputSearch = new FormControl();
  seatMap: SeatMap = {
    building: 'Copac',
    dimension: [5, 9],
    seats: [
      {
        name: 'ABC',
        team: 'XYZ',
        status: 'mnp',
        id: 1,
        image:
          'https://cdna.artstation.com/p/assets/images/images/027/552/530/large/sterrrcore-art-commission-ilovegus-chibi-bust-final.jpg',
        left: 25,
        top: 25,
      },
      {
        name: 'ABC',
        team: 'XYZ',
        status: 'mnp',
        id: 2,
        image:
          'https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/122225393/original/c27ea6bf48ea75188de749a1766c3a90df822adb/draw-chibi-icon-for-you.jpg',
        left: 25,
        top: 75,
      },
      {
        name: 'ABC',
        team: 'XYZ',
        status: 'mnp',
        id: 3,
        image:
          'https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/122225393/original/c27ea6bf48ea75188de749a1766c3a90df822adb/draw-chibi-icon-for-you.jpg',
        left: 75,
        top: 25,
      },
      {
        name: 'ABC',
        team: 'XYZ',
        status: 'mnp',
        id: 4,
        image: 'https://d9jhi50qo719s.cloudfront.net/dlf/samples/jew_800.png',
        left: 75,
        top: 75,
      },
      {
        left: 50,
        top: 50,
      },
    ],
  };

  constructor(
    private dialogService: TuiDialogService,
    private injector: Injector,
    private changeDetector: ChangeDetectorRef
  ) {}

  findMySeat(): void {
    const indexMySeat = this.seatMap.seats?.findIndex((item) => item.id === this.myId);
    if (indexMySeat !== undefined) {
      this.ping = indexMySeat;
      this.seatRefs.toArray()[indexMySeat].elementRef.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
      setTimeout(() => {
        this.ping = null;
        this.changeDetector.detectChanges();
      }, 1000);
    }
  }

  handleDragStarted(event: CdkDragStart, index: number): void {
    this.dragging = true;
    event.source.moved.pipe(takeUntil(event.source.released), last()).subscribe((data) => {
      const halfWidth = this.seatMap.dimension[0] / 2;
      const halfHeight = this.seatMap.dimension[1] / 2;
      const parent = data.source.element.nativeElement.parentElement as HTMLElement;
      const leftDrop = this.seatMap.seats[index].left + (data.distance.x / parent.offsetWidth) * 100;
      const topDrop = this.seatMap.seats[index].top + (data.distance.y / parent.offsetHeight) * 100;

      let indexDrop: number | undefined;
      this.seatMap.seats.some((seat, index) => {
        if (
          leftDrop > seat.left - halfWidth &&
          leftDrop < seat.left + halfWidth &&
          topDrop > seat.top - halfHeight &&
          topDrop < seat.top + halfHeight
        ) {
          indexDrop = index;
          return true;
        } else return false;
      });
      if (indexDrop !== undefined) {
        const drag = this.seatMap.seats[index];
        const drop = this.seatMap.seats[indexDrop];
        [drag.left, drag.top, drag.seatNumber, drop.left, drop.top, drop.seatNumber] = [
          drop.left,
          drop.top,
          drop.seatNumber,
          drag.left,
          drag.top,
          drag.seatNumber,
        ];
        this.changeDetector.detectChanges();
      }
    });
  }

  handleDragEnded(event: CdkDragEnd): void {
    event.source._dragRef.reset();
  }

  initMap(): void {
    this.dialogService
      .open<SeatMap>(new PolymorpheusComponent(InitMapDialogComponent, this.injector), {
        size: 'fullscreen',
        closeable: false,
      })
      .subscribe((map) => {
        this.seatMap = map;
        this.changeDetector.detectChanges();
      });
  }

  onClickSeat(index: number, id?: number): void {
    if (this.dragging) {
      this.dragging = false;
    } else {
      if (id === undefined)
        this.dialogService
          .open<Partial<SeatInfo> | null>(new PolymorpheusComponent(AddSeatDialogComponent, this.injector), {
            size: 's',
            closeable: false,
          })
          .subscribe((seat) => {
            if (seat) {
              const { left, top } = this.seatMap.seats[index];
              this.seatMap.seats[index] = { left, top, ...seat };
              this.changeDetector.detectChanges();
            }
          });
    }
  }

  deleteSeat(index: number): void {
    const { left, top, seatNumber } = this.seatMap.seats[index];
    this.seatMap.seats[index] = { left, top, seatNumber };
    this.changeDetector.detectChanges();
  }
}
