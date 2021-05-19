import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { TuiDialogService } from '@taiga-ui/core';
import { AddSeatDialogComponent } from '../../components/add-seat-dialog/add-seat-dialog.component';
import { ViewDetailDialogComponent } from '../../components/view-detail-dialog/view-detail-dialog.component';
import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { last, takeUntil } from 'rxjs/operators';
import { SeatInfo } from '../../models/models';

@Component({
  selector: 'hcm-seat-map',
  templateUrl: './seat-map.component.html',
  styleUrls: ['./seat-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeatMapComponent implements OnInit {
  dragging = false;
  inputSearch = new FormControl();
  data: SeatInfo[][] = [
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
        id: 1,

        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'check-in',
      },
      {
        id: 2,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'not-check',
      },
      {
        id: 3,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'check-late',
      },
      {
        status: 'empty',
      },
      {
        id: 4,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'leave',
      },
      {
        id: 5,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'offline',
      },
      {
        id: 6,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'offline',
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
        status: 'empty',
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
        id: 8,
        name: 'Huy Pham',
        team: 'IT',
        isBirthday: true,
        status: 'check-in',
      },
    ],
  ];

  constructor(private dialogService: TuiDialogService, private injector: Injector) {}

  ngOnInit(): void {}

  handleClick(x?: number, y?: number): void {
    if (!this.dragging) {
      let item;
      let seatId = null;
      if (x && y) {
        seatId = this.data[y][x].id;
        item = this.data[y][x];
      }
      if (item?.status !== 'none') {
        this.dialogService
          .open<boolean>(new PolymorpheusComponent(ViewDetailDialogComponent, this.injector), {
            size: 's',
            closeable: false,
            data: {
              item: item,
              seats: this.data.map((seats, y) =>
                seats.filter((item) => item.status === 'none').map((item, x) => ({ id: item.id, x, y }))
              ),
            },
          })
          .subscribe();
      } else {
        this.dialogService
          .open(new PolymorpheusComponent(AddSeatDialogComponent, this.injector), {
            size: 's',
            closeable: false,
            data: seatId,
          })
          .subscribe();
      }
    } else {
      this.dragging = false;
    }
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
          this.moveSeat(x, y, xIndex, yIndex);
        }
      }
    });
  }

  handleDragEnded(event: CdkDragEnd): void {
    event.source._dragRef.reset();
  }

  moveSeat(x1: number, y1: number, x2: number, y2: number): void {
    const { id: id1, ...data1 } = this.data[y1][x1];
    const { id: id2, ...data2 } = this.data[y2][x2];
    this.data[y1][x1] = { id: id1, ...data2 };
    this.data[y2][x2] = { id: id2, ...data1 };
  }
}
