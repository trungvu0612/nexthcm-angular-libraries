import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Inject,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { startWith, takeUntil } from 'rxjs/operators';
import { SeatInfo, SeatMap } from '../../models';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

@Component({
  selector: 'hcm-init-map-dialog',
  templateUrl: './init-map-dialog.component.html',
  styleUrls: ['./init-map-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class InitMapDialogComponent implements AfterViewInit {
  @ViewChild('zone') zone!: ElementRef;
  current!: { type?: string; index?: number };
  dragging = false;
  dimension!: number[];
  factor!: number[];
  columns!: number[];
  rows!: number[];
  seats: SeatInfo[] = [];
  seatMap!: SeatInfo[][];
  form = new FormGroup({});
  model = { building: '', cols: 0, rows: 0, seats: 0, dimension: 3 };
  fields: FormlyFieldConfig[] = [
    {
      key: 'building',
      type: 'input',
      className: 'w-1/2 mx-56 mb-4',
      templateOptions: {
        label: 'Building',
        required: true,
        textfieldSize: 'm',
      },
    },
    {
      key: 'cols',
      type: 'input-count',
      templateOptions: {
        label: 'Columns',
        textfieldSize: 'm',
      },
    },
    {
      key: 'rows',
      type: 'input-count',
      className: 'mx-8',
      templateOptions: {
        label: 'Rows',
        textfieldSize: 'm',
      },
    },
    {
      key: 'seats',
      type: 'input-count',
      className: 'mr-8',
      templateOptions: {
        label: 'Seats',
        textfieldSize: 'm',
      },
    },
    {
      key: 'dimension',
      type: 'input-count',
      templateOptions: {
        label: 'Dimension',
        min: 1,
        max: 100,
        textfieldSize: 'm',
      },
    },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private context: TuiDialogContext<Partial<SeatMap>>,
    private destroy$: TuiDestroyService
  ) {}

  ngAfterViewInit(): void {
    this.factor = [this.zone.nativeElement.offsetWidth / 100, this.zone.nativeElement.offsetHeight / 100];

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.columns = Array.from({ length: value.cols }, (_, index) => this.columns[index] || 50);
      this.rows = Array.from({ length: value.rows }, (_, index) => this.rows[index] || 50);
      this.seatMap = this.rows.map((positionY, y) =>
        this.columns.map((positionX, x) => ({
          positionX,
          positionY,
          isSeat: this.seatMap[y] && this.seatMap[y][x] ? this.seatMap[y][x].isSeat : false,
        }))
      );
    });

    this.form.controls.dimension.valueChanges.pipe(startWith(3), takeUntil(this.destroy$)).subscribe((value) => {
      this.dimension = [value, (value * this.factor[0]) / this.factor[1]];
    });

    this.form.controls.seats.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.seats = this.seats.slice(0, value);
      const remain = value - this.seats.length;
      if (remain > 0) {
        this.seats.push(
          ...Array.from({ length: remain }, () => ({
            positionX: 50,
            positionY: 50,
            isSeat: true,
          }))
        );
      }
    });
  }

  @HostListener('window:click', ['$event.target'])
  clickEvent(target: HTMLElement) {
    if (
      target.classList.value.search('line') !== -1 ||
      (target.offsetParent && target.offsetParent.classList.value.search('line') !== -1)
    ) {
      if (
        target.classList.value.search('rowLine') !== -1 ||
        (target.offsetParent && target.offsetParent.classList.value.search('rowLine') !== -1)
      ) {
        this.current.type = 'row';
      } else {
        this.current.type = 'column';
      }
    } else this.current = {};
  }

  @HostListener('window:keyup', ['$event.key'])
  moveByArrowKey(key: string) {
    if (this.current.type !== undefined) {
      let distance = 0;
      if (this.current.type === 'row') {
        if (key === 'ArrowUp') distance = -1;
        if (key === 'ArrowDown') distance = 1;
      } else {
        if (key === 'ArrowLeft') distance = -1;
        if (key === 'ArrowRight') distance = 1;
      }
      this.moveLine(this.current.index || 0, distance, this.current.type);
    }
  }

  isClicked(type: string, index: number): boolean {
    return this.current && this.current.type === type && this.current.index === index;
  }

  onClickLine(index: number): void {
    this.current.index = index;
  }

  moveLine(index: number, distance: number, typeLine: string): void {
    const updateMap = (lines: number[], dimension: number, factor: number): void => {
      const limit = dimension / 2;
      lines[index] += distance / factor;
      if (lines[index] > 100 - limit) lines[index] = 100 - limit;
      if (lines[index] < limit) lines[index] = limit;
    };

    if (typeLine === 'row') {
      updateMap(this.rows, this.dimension[1], this.factor[1]);
      this.seatMap[index].forEach((seat) => (seat.positionY = this.rows[index]));
    } else {
      updateMap(this.columns, this.dimension[0], this.factor[0]);
      this.seatMap.forEach((row) => (row[index].positionX = this.columns[index]));
    }
  }

  moveSeatWithLines(x: number, y: number, event: CdkDragEnd): void {
    this.moveLine(y, event.distance.y, 'row');
    this.moveLine(x, event.distance.x, 'column');
    this.onDragEnded(event);
  }

  moveSeat(index: number, event: CdkDragEnd): void {
    const updateSeat = (key: 'positionX' | 'positionY', limit: number, distance: number, factor: number) => {
      this.seats[index][key] += distance / factor;
      if (this.seats[index][key] > 100 - limit) this.seats[index][key] = 100 - limit;
      if (this.seats[index][key] < limit) this.seats[index][key] = limit;
    };
    updateSeat('positionX', this.dimension[0] / 2, event.distance.x, this.factor[0]);
    updateSeat('positionY', this.dimension[1] / 2, event.distance.y, this.factor[1]);
    this.onDragEnded(event);
  }

  onDragStarted(): void {
    this.dragging = true;
  }

  onDragEnded(event: CdkDragEnd): void {
    event.source._dragRef.reset();
  }

  toggleSeat(seat: SeatInfo): void {
    if (this.dragging) this.dragging = false;
    else seat.isSeat = !seat.isSeat;
  }

  submit(): void {
    this.seatMap.push(this.seats);
    this.context.completeWith({
      building: this.model.building,
      scaleX: this.dimension[0],
      scaleY: this.dimension[1],
      seats: (this.seatMap as any)
        .flat()
        .filter((seat: SeatInfo) => seat.isSeat)
        .map(({ positionX, positionY }: SeatInfo) => ({
          positionX,
          positionY,
        })),
    });
  }
}
