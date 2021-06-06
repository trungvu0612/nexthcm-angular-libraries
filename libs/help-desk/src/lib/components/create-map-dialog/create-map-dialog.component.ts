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
import { SeatMap, StyleSeat } from '../../models';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

type Key = 'width' | 'height' | 'rounded';
const keys: Key[] = ['width', 'height', 'rounded'];

@Component({
  selector: 'hcm-init-map-dialog',
  templateUrl: './create-map-dialog.component.html',
  styleUrls: ['./create-map-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class CreateMapDialogComponent implements AfterViewInit {
  @ViewChild('zone') zone!: ElementRef;
  zoomControl = new FormControl<number>(90);
  dragging = false;
  keepFocus = false;
  current: { type?: string; index?: number; y?: number } = {};
  factor!: { width: number; height: number; rounded: number };
  dimension = { width: 0, height: 0, rounded: 0 };
  columns: number[] = [];
  rows: number[] = [];
  seats: StyleSeat[] = [];
  seatMap!: StyleSeat[][];

  form = new FormGroup({});
  model = { columns: 0, rows: 0, seats: 0, width: 40, height: 40, rounded: 0 };
  fields: FormlyFieldConfig[] = [
    {
      key: 'columns',
      type: 'input-count',
      templateOptions: {
        label: 'Columns',
        textfieldSize: 'm',
      },
    },
    {
      key: 'rows',
      type: 'input-count',
      className: 'mx-4',
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
      className: 'mx-4',
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
      className: 'mx-4',
      templateOptions: {
        label: 'Rounded (%)',
        max: 50,
        textfieldSize: 'm',
      },
    },
  ];

  seatForm = new FormGroup({
    width: new FormControl<number>(0),
    height: new FormControl<number>(0),
    rounded: new FormControl<number>(0),
  });
  seatModel = { width: 0, height: 0, rounded: 0 };
  seatFields: FormlyFieldConfig[] = [
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
      className: 'mx-4',
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

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT) private context: TuiDialogContext<Partial<SeatMap>>,
    private destroy$: TuiDestroyService
  ) {}

  get currentSeat(): StyleSeat {
    if (this.current.index !== undefined) {
      if (this.current.y === undefined) return this.seats[this.current.index];
      else return this.seatMap[this.current.index][this.current.y];
    } else return { positionX: 0, positionY: 0 };
  }

  ngAfterViewInit(): void {
    this.updateFactor();
    this.zoomControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => (this.keepFocus = true));

    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.columns = Array.from({ length: value.columns }, (_, index) => this.columns[index] || 50);
      this.rows = Array.from({ length: value.rows }, (_, index) => this.rows[index] || 50);
      this.seatMap = this.rows.map((positionY, y) =>
        this.columns.map((positionX, x) => {
          if (this.seatMap[y] && this.seatMap[y][x]) return this.seatMap[y][x];
          else return { positionX, positionY };
        })
      );
      if (!this.model.seats && !this.model.columns && !this.model.rows) this.current = {};
    });

    this.form.controls.seats.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.seats = Array.from(
        { length: value },
        (_, index) =>
          this.seats[index] || {
            positionX: 50,
            positionY: 50,
            isSeat: true,
          }
      );
      this.onFocus('seat', value - 1);
    });

    keys.forEach((key) => {
      this.form.controls[key].valueChanges
        .pipe(startWith(this.model[key]), takeUntil(this.destroy$))
        .subscribe((value) => {
          if (key !== 'rounded') {
            if (value > this.zone.nativeElement['offset' + key[0].toUpperCase() + key.slice(1)]) {
              this.form.controls.width.setValue(this.zone.nativeElement.offsetWidth);
              return;
            }
          }
          this.dimension[key] = value / this.factor[key];
          this.updateSeatForm();
        });
    });

    const updateSeat = (key: Key, value: number, factor?: number): void => {
      if (this.current.type === 'seat' && this.current.index !== undefined) {
        if (value !== this.model[key] || this.currentSeat[key] !== undefined) {
          keys.forEach((key) => {
            if (this.currentSeat[key] === undefined) this.currentSeat[key] = this.model[key] / this.factor[key];
          });
          if (factor) value /= factor;
          this.currentSeat[key] = value;
        }
      }
    };

    const handleSeatFormValueChange = (key: 'width' | 'height', value: number, factor: number): void => {
      if (value > factor * 100) this.seatForm.controls[key].setValue(factor * 100);
      else updateSeat(key, value, factor);
    };

    const seatForm = this.seatForm.controls;
    seatForm.width.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      handleSeatFormValueChange('width', value, this.factor.width);
    });
    seatForm.height.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      handleSeatFormValueChange('height', value, this.factor.height);
    });
    seatForm.rounded.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      updateSeat('rounded', value);
    });
  }

  @HostListener('window:resize')
  onResize() {
    this.updateFactor();
    keys.forEach((key) => {
      this.form.controls[key].patchValue(this.dimension[key] * this.factor[key], { emitEvent: false });
    });
    this.updateSeatForm();
  }

  @HostListener('window:click', ['$event.path'])
  clickEvent(path: HTMLElement[]) {
    if (this.keepFocus) {
      this.keepFocus = false;
    } else if (path.map((e) => e.nodeName).includes('ARTICLE')) {
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

  @HostListener('window:keydown', ['$event'])
  moveByArrowKey(event: KeyboardEvent) {
    if (this.current.type !== undefined && this.current.index !== undefined) {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        event.preventDefault();
        const distanceObj = { x: 0, y: 0 };
        if (event.key === 'ArrowLeft') distanceObj.x = -1;
        if (event.key === 'ArrowRight') distanceObj.x = 1;
        if (event.key === 'ArrowUp') distanceObj.y = -1;
        if (event.key === 'ArrowDown') distanceObj.y = 1;

        if (this.current.type === 'column') {
          distanceObj.x && this.moveLine(this.current.index, distanceObj.x, 'column');
        } else if (this.current.type === 'row') {
          distanceObj.y && this.moveLine(this.current.index, distanceObj.y, 'row');
        } else if (this.current.y !== undefined)
          this.moveSeatWithLines(this.current.index, this.current.y, distanceObj);
        else this.moveSeat(this.current.index, distanceObj);
      }
    }
  }

  updateFactor(): void {
    this.factor = {
      width: this.zone.nativeElement.offsetWidth / 100,
      height: this.zone.nativeElement.offsetHeight / 100,
      rounded: 1,
    };
  }

  getRounded(rounded: number | undefined): number {
    if (rounded === undefined) return this.dimension.rounded;
    else return rounded;
  }

  isFocus(type: string, index: number, y?: number): boolean {
    return this.current && this.current.type === type && this.current.index === index && this.current.y === y;
  }

  onFocus(type: string, index: number, y?: number): void {
    this.current = { type, index, y };
    this.updateSeatForm();
  }

  onReset(): void {
    this.keepFocus = true;
    keys.forEach((key) => {
      delete this.currentSeat[key];
    });
    this.updateSeatForm();
  }

  onDragStarted(): void {
    this.dragging = true;
  }

  onToggleSeat(index: number, y: number, seat: StyleSeat): void {
    if (this.dragging) this.dragging = false;
    else seat.isSeat = !seat.isSeat;
    this.onFocus('seat', index, y);
  }

  updateSeatForm(): void {
    if (this.current.type === 'seat' && this.current.index !== undefined) {
      const width = (this.currentSeat.width || this.dimension.width) * this.factor.width;
      const height = (this.currentSeat.height || this.dimension.height) * this.factor.height;
      const rounded = this.currentSeat.rounded !== undefined ? this.currentSeat.rounded : this.model.rounded;
      this.seatModel = { width, height, rounded };
      this.seatForm.setValue(this.seatModel, { emitEvent: false });
    }
  }

  moveLine(index: number, distance: number, typeLine: string): void {
    const updateMap = (lines: number[], dimension: number, factor: number): void => {
      const limit = dimension / 2;
      lines[index] += distance / factor;
      if (lines[index] > 100 - limit) lines[index] = 100 - limit;
      if (lines[index] < limit) lines[index] = limit;
    };

    if (typeLine === 'column') {
      updateMap(this.columns, this.dimension.width, this.factor.width);
      this.seatMap.forEach((row) => (row[index].positionX = this.columns[index]));
    } else {
      updateMap(this.rows, this.dimension.height, this.factor.height);
      this.seatMap[index].forEach((seat) => (seat.positionY = this.rows[index]));
    }
  }

  moveSeatWithLines(x: number, y: number, distance: { x: number; y: number }, event?: CdkDragEnd): void {
    this.moveLine(x, distance.x, 'column');
    this.moveLine(y, distance.y, 'row');
    event && event.source._dragRef.reset();
  }

  moveSeat(index: number, distance: { x: number; y: number }, event?: CdkDragEnd): void {
    event && event.source._dragRef.reset();
    const updateSeat = (key: 'positionX' | 'positionY', limit: number, distance: number, factor: number) => {
      this.seats[index][key] += distance / factor;
      if (this.seats[index][key] > 100 - limit) this.seats[index][key] = 100 - limit;
      if (this.seats[index][key] < limit) this.seats[index][key] = limit;
    };
    updateSeat('positionX', this.dimension.width / 2, distance.x, this.factor.width);
    updateSeat('positionY', this.dimension.height / 2, distance.y, this.factor.height);
  }

  submit(): void {
    this.seatMap.push(this.seats);
    console.log(this.dimension, this.model.rounded, (this.seatMap as any).flat());
    // this.context.completeWith({
    //   width: this.dimension.width,
    //   height: this.dimension.height,
    //   rounded: this.model.rounded,
    //   seats: (this.seatMap as any)
    //     .flat()
    //     .filter((seat: StyleSeat) => seat.isSeat)
    //     .map(({ positionX, positionY, width, height }: StyleSeat) =>
    //       !width || !height || (width === this.dimension.width && height === this.dimension.height)
    //         ? {
    //             positionX,
    //             positionY,
    //           }
    //         : {
    //             positionX,
    //             positionY,
    //             width,
    //             height,
    //           }
    //     ),
    // });
  }
}
