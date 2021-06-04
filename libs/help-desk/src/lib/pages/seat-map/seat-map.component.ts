import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { last, takeUntil } from 'rxjs/operators';
import { AddSeatDialogComponent } from '../../components/add-seat-dialog/add-seat-dialog.component';
import { CreateMapDialogComponent } from '../../components/create-map-dialog/create-map-dialog.component';
import { SeatInfo, SeatMap } from '../../models';
import { SeatComponent } from '../../components/seat/seat.component';
import { SeatMapService } from '../../services/seat-map.service';

@Component({
  selector: 'hcm-seat-map',
  templateUrl: './seat-map.component.html',
  styleUrls: ['./seat-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeatMapComponent implements OnInit {
  @ViewChildren(SeatComponent) seatRefs!: QueryList<SeatComponent>;
  myId = 4;
  ping: number | null = null;
  dragging = false;
  inputSearch = new FormControl();
  seatMap!: SeatMap;

  constructor(
    private seatMapService: SeatMapService,
    private dialogService: TuiDialogService,
    private injector: Injector,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.seatMapService.getSeatMapData().subscribe((data) => (this.seatMap = data));
  }

  createMap(): void {
    this.dialogService
      .open<SeatMap>(new PolymorpheusComponent(CreateMapDialogComponent, this.injector), {
        size: 'page',
      })
      .subscribe((map) => {
        this.seatMap = map;
        this.changeDetector.detectChanges();
      });
  }

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

  handleDragEnded(event: CdkDragEnd): void {
    event.source._dragRef.reset();
  }

  moveSeat(event: CdkDragStart, index: number): void {
    this.dragging = true;
    event.source.moved.pipe(takeUntil(event.source.released), last()).subscribe((data) => {
      const halfWidth = this.seatMap.scaleX / 2;
      const halfHeight = this.seatMap.scaleY / 2;
      const parent = data.source.element.nativeElement.parentElement as HTMLElement;
      const positionXDrop = this.seatMap.seats[index].positionX + (data.distance.x / parent.offsetWidth) * 100;
      const positionYDrop = this.seatMap.seats[index].positionY + (data.distance.y / parent.offsetHeight) * 100;

      let indexDrop: number | undefined;
      this.seatMap.seats.some((seat, index) => {
        if (
          positionXDrop > seat.positionX - halfWidth &&
          positionXDrop < seat.positionX + halfWidth &&
          positionYDrop > seat.positionY - halfHeight &&
          positionYDrop < seat.positionY + halfHeight
        ) {
          indexDrop = index;
          return true;
        } else return false;
      });

      if (indexDrop !== undefined) {
        const drag = this.seatMap.seats[index];
        const drop = this.seatMap.seats[indexDrop];
        [drag.positionX, drag.positionY, drag.seatNumber, drop.positionX, drop.positionY, drop.seatNumber] = [
          drop.positionX,
          drop.positionY,
          drop.seatNumber,
          drag.positionX,
          drag.positionY,
          drag.seatNumber,
        ];
        this.seatMapService.postSeatMapData(this.seatMap);
        this.changeDetector.detectChanges();
      }
    });
  }

  addSeat(index: number, id?: number): void {
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
              const { positionX, positionY } = this.seatMap.seats[index];
              this.seatMap.seats[index] = { positionX, positionY, ...seat };
              this.seatMapService.postSeatMapData(this.seatMap);
              this.changeDetector.detectChanges();
            }
          });
    }
  }

  deleteSeat(index: number): void {
    const { positionX, positionY, seatNumber } = this.seatMap.seats[index];
    this.seatMap.seats[index] = { positionX, positionY, seatNumber };
    this.seatMapService.postSeatMapData(this.seatMap);
    this.changeDetector.detectChanges();
  }
}
