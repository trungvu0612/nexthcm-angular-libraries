import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Injector,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { last, takeUntil } from 'rxjs/operators';
import { AddSeatDialogComponent } from '../../components/add-seat-dialog/add-seat-dialog.component';
import { CreateSeatMapDialogComponent } from '../../components/create-seat-map-dialog/create-seat-map-dialog.component';
import { ViewDetailDialogComponent } from '../../components/view-detail-dialog/view-detail-dialog.component';
import { Dispatch, SeatInfo } from '../../models/seat-map';

@Component({
  selector: 'hcm-seat-map',
  templateUrl: './seat-map.component.html',
  styleUrls: ['./seat-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeatMapComponent implements OnInit {
  @ViewChild('target') mySeat!: ElementRef;
  mySeatNumber = 16;
  ping = false;
  dragging = false;
  inputSearch = new FormControl();
  emptySeats!: (number | undefined)[][];
  data: Partial<SeatInfo>[][] = [
    [
      {
        id: 1,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: false,
        status: 'check-in',
      },
      {
        id: 2,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: false,
        status: 'not-check-in-out',
      },
      {
        id: 3,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: false,
        status: 'check-in-late',
      },
      {
        id: 4,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: false,
        status: 'working-outside',
      },
      {
        id: 5,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'leave',
      },
      {
        id: 6,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'offline',
      },
      {
        status: 'empty',
      },
    ],
    [
      {
        id: 7,
        status: 'none',
      },
      {
        id: 8,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'check-in',
      },
      {
        id: 9,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'check-in',
      },
      {
        id: 10,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'check-in',
      },
      {
        id: 11,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'check-in',
      },
      {
        id: 12,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'check-in',
      },
      {
        status: 'empty',
      },
    ],
    [
      {
        status: 'empty',
      },
      {
        status: 'empty',
      },
      {
        status: 'empty',
      },
      {
        status: 'empty',
      },
      {
        status: 'empty',
      },
      {
        status: 'empty',
      },
      {
        status: 'empty',
      },
    ],
    [
      {
        id: 13,

        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'check-in',
      },
      {
        id: 14,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'not-check',
      },
      {
        id: 15,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'check-late',
      },
      {
        status: 'empty',
      },
      {
        id: 16,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'leave',
      },
      {
        id: 17,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'offline',
      },
      {
        id: 18,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'offline',
      },
    ],
    [
      {
        id: 19,
        status: 'none',
      },
      {
        id: 20,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'check-in',
      },
      {
        id: 21,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'check-in',
      },
      {
        status: 'empty',
      },
      {
        id: 22,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'check-in',
      },
      {
        id: 23,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'check-in',
      },
      {
        id: 24,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'check-in',
      },
    ],
    [
      {
        status: 'empty',
      },
      {
        status: 'empty',
      },
      {
        status: 'empty',
      },
      {
        status: 'empty',
      },
      {
        status: 'empty',
      },
      {
        status: 'empty',
      },
      {
        status: 'empty',
      },
    ],
    [
      {
        status: 'wall',
      },
      {
        status: 'wall',
      },
      {
        status: 'wall',
      },
      {
        status: 'empty',
      },
      {
        id: 25,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'leave',
      },
      {
        id: 26,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'offline',
      },
      {
        id: 27,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'check-in',
      },
    ],
  ];

  constructor(
    private dialogService: TuiDialogService,
    private injector: Injector,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getEmptySeats();
  }

  findMySeat(): void {
    this.ping = true;
    this.mySeat.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    setTimeout(() => {
      this.ping = false;
      this.changeDetector.detectChanges();
    }, 1200);
  }

  handleDragStarted(event: CdkDragStart, x: number, y: number): void {
    this.dragging = true;
    event.source.moved.pipe(takeUntil(event.source.released), last()).subscribe((data) => {
      const parent = data.source.element.nativeElement.parentElement as HTMLElement;
      const unit = parent.offsetWidth / parent.childElementCount;

      const signX = data.distance.x / Math.abs(data.distance.x);
      const distanceX = Math.abs(data.distance.x) + unit / 2;
      const remainderX = (distanceX % unit) / unit;

      const signY = data.distance.y / Math.abs(data.distance.y);
      const distanceY = Math.abs(data.distance.y) + unit / 2;
      const remainderY = (distanceY % unit) / unit;

      if (remainderX > 0.1 && remainderX < 0.9 && remainderY > 0.1 && remainderY < 0.9) {
        const xIndex = x + signX * Math.floor(distanceX / unit);
        const yIndex = y + signY * Math.floor(distanceY / unit);
        if (this.data[yIndex][xIndex].status === 'none') {
          this.dragging = false;
          this.changeSeat([x, y, xIndex, yIndex]);
        }
      }
    });
  }

  handleDragEnded(event: CdkDragEnd): void {
    event.source._dragRef.reset();
  }

  createSeatMap(): void {
    this.dialogService
      .open<Partial<SeatInfo>[][]>(new PolymorpheusComponent(CreateSeatMapDialogComponent, this.injector), {
        size: 'l',
        closeable: false,
      })
      .subscribe((map) => {
        this.data = map;
        this.changeDetector.detectChanges();
      });
  }

  viewDetail(item: Partial<SeatInfo>, x: number, y: number): void {
    if (this.dragging) {
      this.dragging = false;
    } else {
      this.dialogService
        .open<Dispatch<number>>(new PolymorpheusComponent(ViewDetailDialogComponent, this.injector), {
          size: 's',
          closeable: false,
          data: {
            id: item.cif,
            seats: this.emptySeats,
          },
        })
        .subscribe((action) => {
          if (action.type === 'move') {
            this.changeSeat([x, y, ...this.getSeatFromId(action.payload)]);
          } else if (action.type === 'delete') {
            this.changeSeat([x, y]);
          }
        });
    }
  }

  addSeat(id?: number): void {
    this.dialogService
      .open(new PolymorpheusComponent(AddSeatDialogComponent, this.injector), {
        size: 's',
        closeable: false,
        data: id,
      })
      .subscribe((seats) => {
        console.log('TODO add seats', seats);
      });
  }

  getEmptySeats(): void {
    this.emptySeats = this.data.map((seats) => seats.filter((item) => item.status === 'none').map((item) => item.id));
  }

  getSeatFromId(id: number | undefined): number[] {
    let xIndex = 0;
    let yIndex = 0;
    this.data.some((seats, y) => {
      yIndex = y;
      return seats.some((item, x) => {
        xIndex = x;
        return item.id == id;
      });
    });
    return [xIndex, yIndex];
  }

  changeSeat([x1, y1, x2, y2]: number[]): void {
    if (x2 == undefined) {
      this.data[y1][x1] = { status: 'none', id: this.data[y1][x1].id };
    } else {
      const { id: id1, ...data1 } = this.data[y1][x1];
      const { id: id2, ...data2 } = this.data[y2][x2];
      this.data[y1][x1] = { id: id1, ...data2 };
      this.data[y2][x2] = { id: id2, ...data1 };
    }

    this.getEmptySeats();
    this.changeDetector.detectChanges();
  }
}
