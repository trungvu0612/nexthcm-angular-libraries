import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
  dimension = [3, 4];
  columns: number[] = [50];
  rows: number[] = [50];
  seatMap: SeatInfo[][] = [[{ top: 50, left: 50, isSeat: false }]];
  form = new FormGroup({});
  model = { building: '', cols: 1, rows: 1, dimension: 3 };
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
        min: 1,
        textfieldSize: 'm',
      },
    },
    {
      key: 'rows',
      type: 'input-count',
      className: 'mx-8',
      templateOptions: {
        label: 'Rows',
        min: 1,
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

  isClicked(type: string, index: number): boolean {
    return this.current && this.current.type === type && this.current.index === index;
  }

  constructor(
    private changeDetector: ChangeDetectorRef,
    @Inject(POLYMORPHEUS_CONTEXT) private context: TuiDialogContext<Partial<SeatMap>>,
    private destroy$: TuiDestroyService
  ) {}

  ngAfterViewInit(): void {
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.columns = Array.from({ length: value.cols }, (_, index) => this.columns[index] || 50);
      this.rows = Array.from({ length: value.rows }, (_, index) => this.rows[index] || 50);
      this.seatMap = this.rows.map((top, y) =>
        this.columns.map((left, x) => ({
          top,
          left,
          isSeat: this.seatMap[y] && this.seatMap[y][x] ? this.seatMap[y][x].isSeat : false,
        }))
      );
    });

    this.form.controls.dimension.valueChanges.pipe(startWith(3), takeUntil(this.destroy$)).subscribe((value) => {
      this.dimension = [value, (value * this.zone.nativeElement.offsetWidth) / this.zone.nativeElement.offsetHeight];
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

  onClickOnLine(index: number): void {
    this.current.index = index;
  }

  moveLine(index: number, distance: number, typeLine: string): void {
    const updateMap = (lines: number[], factor: number): void => {
      const limit = (this.model.dimension * factor) / 2;
      lines[index] += distance * factor;
      if (lines[index] > 100 - limit) lines[index] = 100 - limit;
      if (lines[index] < limit) lines[index] = limit;
    };

    if (typeLine === 'row') {
      updateMap(this.rows, 100 / this.zone.nativeElement.offsetHeight);
      this.seatMap[index].forEach((seat) => (seat.top = this.rows[index]));
    } else {
      updateMap(this.columns, 100 / this.zone.nativeElement.offsetWidth);
      this.seatMap.forEach((row) => (row[index].left = this.columns[index]));
    }
  }

  moveSeat(x: number, y: number, event: CdkDragEnd): void {
    this.moveLine(y, event.distance.y, 'row');
    this.moveLine(x, event.distance.x, 'column');
    event.source._dragRef.reset();
  }

  onDragStarted(): void {
    this.dragging = true;
  }

  toggleSeat(seat: SeatInfo): void {
    if (this.dragging) this.dragging = false;
    else seat.isSeat = !seat.isSeat;
  }

  submit(): void {
    this.context.completeWith({
      building: this.model.building,
      dimension: this.dimension,
      seats: (this.seatMap as any)
        .flat()
        .filter((seat: SeatInfo) => seat.isSeat)
        .map(({ left, top }: SeatInfo) => ({
          left,
          top,
        })),
    });
  }
}
