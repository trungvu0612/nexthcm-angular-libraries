import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  Inject,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { startWith, takeUntil } from 'rxjs/operators';
import { SeatInfo, SeatMap } from '../../models';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

@Component({
  selector: 'hcm-init-map-dialog',
  templateUrl: './create-map-dialog.component.html',
  styleUrls: ['./create-map-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class CreateMapDialogComponent implements AfterViewInit {
  @ViewChild('zone') zone!: ElementRef;
  dragging = false;
  current: { type?: string; index?: number; y?: number } = {};

  factor!: number[];
  dimension = [0, 0];
  columns: number[] = [];
  rows: number[] = [];
  seats: SeatInfo[] = [];
  seatMap!: SeatInfo[][];

  form = new FormGroup({});
  model = { cols: 0, rows: 0, seats: 0, width: 40, height: 40, rounded: 0 };
  fields: FormlyFieldConfig[] = [
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
      templateOptions: {
        label: 'Rows',
        textfieldSize: 'm',
      },
    },
    {
      key: 'seats',
      type: 'input-count',
      templateOptions: {
        label: 'Seats',
        textfieldSize: 'm',
      },
    },
    {
      key: 'width',
      type: 'input-count',
      templateOptions: {
        label: 'Width (px)',
        min: 1,
        textfieldSize: 'm',
      },
    },
    {
      key: 'height',
      type: 'input-count',
      templateOptions: {
        label: 'Height (px)',
        min: 1,
        textfieldSize: 'm',
      },
    },
    {
      key: 'rounded',
      type: 'input-count',
      templateOptions: {
        label: 'Rounded (%)',
        max: 50,
        textfieldSize: 'm',
      },
    },
  ];

  seatForm = new FormGroup({ width: new FormControl<number>(0), height: new FormControl<number>(0) });
  seatModel = { width: 0, height: 0 };
  seatFields: FormlyFieldConfig[] = [
    {
      key: 'width',
      type: 'input-count',
      templateOptions: {
        label: 'Width (px)',
        textfieldSize: 'm',
      },
    },
    {
      key: 'height',
      type: 'input-count',
      templateOptions: {
        label: 'Height (px)',
        textfieldSize: 'm',
      },
    },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private context: TuiDialogContext<Partial<SeatMap>>,
    private destroy$: TuiDestroyService
  ) {}

  ngAfterViewInit(): void {
    this.updateFactor();

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.columns = Array.from({ length: value.cols }, (_, index) => this.columns[index] || 50);
      this.rows = Array.from({ length: value.rows }, (_, index) => this.rows[index] || 50);
      this.seatMap = this.rows.map((positionY, y) =>
        this.columns.map((positionX, x) => ({
          positionX,
          positionY,
          scaleX: this.seatMap[y] && this.seatMap[y][x] ? this.seatMap[y][x].scaleX : 0,
          scaleY: this.seatMap[y] && this.seatMap[y][x] ? this.seatMap[y][x].scaleY : 0,
          isSeat: this.seatMap[y] && this.seatMap[y][x] ? this.seatMap[y][x].isSeat : false,
        }))
      );
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

    this.form.controls.width.valueChanges.pipe(startWith(40), takeUntil(this.destroy$)).subscribe((value) => {
      if (value > this.zone.nativeElement.offsetWidth)
        this.form.controls.width.setValue(this.zone.nativeElement.offsetWidth);
      else this.dimension[0] = value / this.factor[0];
    });

    this.form.controls.height.valueChanges.pipe(startWith(40), takeUntil(this.destroy$)).subscribe((value) => {
      if (value > this.zone.nativeElement.offsetHeight)
        this.form.controls.height.setValue(this.zone.nativeElement.offsetHeight);
      else this.dimension[1] = value / this.factor[1];
    });

    this.seatForm.controls.width.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.handleSeatFormValueChange('scaleX', value, this.factor[0]);
    });

    this.seatForm.controls.height.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.handleSeatFormValueChange('scaleY', value, this.factor[1]);
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.updateFactor();
  }

  @HostListener('window:click', ['$event.path'])
  clickEvent(path: HTMLElement[]) {
    if (path.map((e) => e.nodeName).includes('ARTICLE')) {
      if (
        path[0].nodeName !== 'svg' &&
        path[0].classList.value.search('line') === -1 &&
        path[0].offsetParent &&
        path[0].offsetParent.classList.value.search('line') === -1
      ) {
        this.current = {};
      }
    } else if (!path.map((e) => e.nodeName).includes('FORMLY-FORM')) {
      this.current = {};
    }
  }

  @HostListener('window:keyup', ['$event.key'])
  moveByArrowKey(key: string) {
    if (this.current.type !== undefined) {
      let distance = 0;
      if (this.current.type === 'row') {
        if (key === 'ArrowUp') distance = -1;
        if (key === 'ArrowDown') distance = 1;
      } else if (this.current.type === 'column') {
        if (key === 'ArrowLeft') distance = -1;
        if (key === 'ArrowRight') distance = 1;
      } else if (this.current.index !== undefined) {
        const distanceObj = { x: 0, y: 0 };
        if (key === 'ArrowLeft') distanceObj.x = -1;
        if (key === 'ArrowRight') distanceObj.x = 1;
        if (key === 'ArrowUp') distanceObj.y = -1;
        if (key === 'ArrowDown') distanceObj.y = 1;
        if (this.current.y !== undefined) this.moveSeatWithLines(this.current.index, this.current.y, distanceObj);
        else this.moveSeat(this.current.index, distanceObj);
      }
      this.moveLine(this.current.index || 0, distance, this.current.type);
    }
  }

  updateFactor(): void {
    this.factor = [this.zone.nativeElement.offsetWidth / 100, this.zone.nativeElement.offsetHeight / 100];
  }

  isClicked(type: string, index: number, y?: number): boolean {
    return this.current && this.current.type === type && this.current.index === index && this.current.y === y;
  }

  updateSeatForm(index: number, y?: number): void {
    let seat: any;
    if (y === undefined) seat = this.seats[index];
    else seat = this.seatMap[index][y];
    const width = (seat.scaleX || this.dimension[0]) * this.factor[0];
    const height = (seat.scaleY || this.dimension[1]) * this.factor[1];
    this.seatModel = { width, height };
    this.seatForm.setValue(this.seatModel, { emitEvent: false });
  }

  handleSeatFormValueChange(key: 'scaleX' | 'scaleY', value: number, factor: number): void {
    if (this.current.type === 'seat' && this.current.index !== undefined) {
      let scale = 0;
      if (value > factor * 100) this.seatForm.controls.width.setValue(factor * 100);
      else scale = value / factor;
      if (scale) {
        let seat;
        if (this.current.y === undefined) seat = this.seats[this.current.index];
        else seat = this.seatMap[this.current.y][this.current.index];
        seat[key] = scale;
      }
    }
  }

  onClick(type: string, index: number): void {
    if (type === 'seat') this.updateSeatForm(index);
    this.current = { type, index };
  }

  onToggleSeat(index: number, y: number, seat: SeatInfo): void {
    if (this.dragging) this.dragging = false;
    else seat.isSeat = !seat.isSeat;
    this.updateSeatForm(index, y);
    this.current = { type: 'seat', index, y };
  }

  onDragStarted(): void {
    this.dragging = true;
  }

  onDragEnded(event: CdkDragEnd): void {
    event.source._dragRef.reset();
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

  moveSeatWithLines(x: number, y: number, distance: { x: number; y: number }, event?: CdkDragEnd): void {
    this.moveLine(x, distance.x, 'column');
    this.moveLine(y, distance.y, 'row');
    if (event) this.onDragEnded(event);
  }

  moveSeat(index: number, distance: { x: number; y: number }, event?: CdkDragEnd): void {
    const updateSeat = (key: 'positionX' | 'positionY', limit: number, distance: number, factor: number) => {
      this.seats[index][key] += distance / factor;
      if (this.seats[index][key] > 100 - limit) this.seats[index][key] = 100 - limit;
      if (this.seats[index][key] < limit) this.seats[index][key] = limit;
    };
    updateSeat('positionX', this.dimension[0] / 2, distance.x, this.factor[0]);
    updateSeat('positionY', this.dimension[1] / 2, distance.y, this.factor[1]);
    if (event) this.onDragEnded(event);
  }

  submit(): void {
    this.seatMap.push(this.seats);
    this.context.completeWith({
      scaleX: this.dimension[0],
      scaleY: this.dimension[1],
      rounded: this.model.rounded,
      seats: (this.seatMap as any)
        .flat()
        .filter((seat: SeatInfo) => seat.isSeat)
        .map(({ positionX, positionY, scaleX, scaleY }: SeatInfo) =>
          !scaleX || !scaleY || (scaleX === this.dimension[0] && scaleY === this.dimension[1])
            ? {
                positionX,
                positionY,
              }
            : {
                positionX,
                positionY,
                scaleX,
                scaleY,
              }
        ),
    });
  }
}
