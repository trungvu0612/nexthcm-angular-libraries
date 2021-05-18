import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { FormControl } from '@ngneat/reactive-forms';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { TuiDialogService } from '@taiga-ui/core';
import { AddSeatDialogComponent } from '../../components/add-seat-dialog/add-seat-dialog.component';
import { ViewDetailDialogComponent } from '../../components/view-detail-dialog/view-detail-dialog.component';
import { CdkDragEnd, CdkDragStart } from '@angular/cdk/drag-drop';
import { last, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'hcm-seat-map',
  templateUrl: './seat-map.component.html',
  styleUrls: ['./seat-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeatMapComponent implements OnInit {
  dragging = false;
  inputSearch = new FormControl();
  data: any[][] = [
    [
      {
        id: 1,
        name: 'Huy Pham',
        role: 'IT',
        isBirthday: false,
        status: 'check-in',
      },
      {
        id: 2,
        name: 'Huy Pham',
        role: 'IT',
        isBirthday: false,
        status: 'not-check-in-out',
      },
      {
        id: 3,
        name: 'Huy Pham',
        role: 'IT',
        isBirthday: false,
        status: 'check-in-late',
      },
      {
        id: 4,
        name: 'Huy Pham',
        role: 'IT',
        isBirthday: false,
        status: 'working-outside',
      },
      {
        id: 5,
        name: 'Huy Pham',
        role: 'IT',
        isBirthday: true,
        status: 'leave',
      },
      {
        id: 6,
        name: 'Huy Pham',
        role: 'IT',
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
        role: 'IT',
        isBirthday: true,
        status: 'check-in',
      },
      {
        id: 9,
        name: 'Huy Pham',
        role: 'IT',
        isBirthday: true,
        status: 'check-in',
      },
      {
        id: 10,
        name: 'Huy Pham',
        role: 'IT',
        isBirthday: true,
        status: 'check-in',
      },
      {
        id: 11,
        name: 'Huy Pham',
        role: 'IT',
        isBirthday: true,
        status: 'check-in',
      },
      {
        id: 12,
        name: 'Huy Pham',
        role: 'IT',
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
        role: 'IT',
        isBirthday: true,
        status: 'check-in',
      },
      {
        id: 2,
        name: 'Huy Pham',
        role: 'IT',
        isBirthday: true,
        status: 'not-check',
      },
      {
        id: 3,
        name: 'Huy Pham',
        role: 'IT',
        isBirthday: true,
        status: 'check-late',
      },
      {
        status: 'empty',
      },
      {
        id: 4,
        name: 'Huy Pham',
        role: 'IT',
        isBirthday: true,
        status: 'leave',
      },
      {
        id: 5,
        name: 'Huy Pham',
        role: 'IT',
        isBirthday: true,
        status: 'offline',
      },
      {
        id: 6,
        name: 'Huy Pham',
        role: 'IT',
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
        role: 'IT',
        isBirthday: true,
        status: 'check-in',
      },
      {
        id: 9,
        name: 'Huy Pham',
        role: 'IT',
        isBirthday: true,
        status: 'check-in',
      },
      {
        status: 'empty',
      },
      {
        id: 10,
        name: 'Huy Pham',
        role: 'IT',
        isBirthday: true,
        status: 'check-in',
      },
      {
        id: 11,
        name: 'Huy Pham',
        role: 'IT',
        isBirthday: true,
        status: 'check-in',
      },
      {
        id: 12,
        name: 'Huy Pham',
        role: 'IT',
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
        role: 'IT',
        isBirthday: true,
        status: 'leave',
      },
      {
        id: 6,
        name: 'Huy Pham',
        role: 'IT',
        isBirthday: true,
        status: 'offline',
      },
      {
        id: 8,
        name: 'Huy Pham',
        role: 'IT',
        isBirthday: true,
        status: 'check-in',
      },
    ],
  ];

  constructor(private dialogService: TuiDialogService, private injector: Injector) {}

  ngOnInit(): void {}

  handleClick(item?: any): void {
    if (!this.dragging) {
      if (item) {
        this.dialogService
          .open<boolean>(new PolymorpheusComponent(ViewDetailDialogComponent, this.injector), {
            size: 's',
            closeable: false,
            data: item,
          })
          .subscribe();
      } else {
        this.dialogService
          .open(new PolymorpheusComponent(AddSeatDialogComponent, this.injector), {
            size: 's',
            closeable: false,
            data: item,
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
          const { id: dragId, ...transferData } = this.data[y][x];
          const { id: dropId, ...emptyData } = this.data[yIndex][xIndex];
          this.data[y][x] = { id: dragId, ...emptyData };
          this.data[yIndex][xIndex] = { id: dropId, ...transferData };
        }
      }
    });
  }

  handleDragEnded(event: CdkDragEnd): void {
    event.source._dragRef.reset();
  }
}
