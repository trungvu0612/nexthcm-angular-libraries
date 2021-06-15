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
import { FormBuilder, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { Dimension, SeatMapForm, SeatZone, StyleSeat } from '../../models/offices';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { startWith, takeUntil } from 'rxjs/operators';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

const keys: ('width' | 'height' | 'rounded')[] = ['width', 'height', 'rounded'];

@Component({
  selector: 'hcm-room-detail',
  templateUrl: './room-detail-dialog.component.html',
  styleUrls: ['./room-detail-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class RoomDetailDialogComponent implements AfterViewInit {
  @ViewChild('zone') zone!: ElementRef;
  title!: string;
  imageControl = new FormControl<File>();
  keepFocus = false;
  current = -1;
  factor = { width: 0, height: 0, rounded: 1 };
  dimension = { width: 0, height: 0, rounded: 0 };
  seats: StyleSeat[] = [];

  form: FormGroup<SeatMapForm>;
  model: SeatMapForm = { office: '', name: '', image: '', seats: 0, width: 40, height: 40, rounded: 0 };
  fields: FormlyFieldConfig[] = [
    {
      key: 'office',
      type: 'input',
      templateOptions: {
        label: 'office',
        translate: true,
        required: true,
        textfieldSize: 'm',
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'name',
      type: 'input',
      templateOptions: {
        label: 'room',
        translate: true,
        required: true,
        textfieldSize: 'm',
        textfieldLabelOutside: true,
      },
    },
    {
      key: 'seats',
      type: 'input-count',
      templateOptions: {
        label: 'numberOfSeat',
        translate: true,
        required: true,
        textfieldSize: 'm',
        textfieldLabelOutside: true,
      },
      expressionProperties: {
        'templateOptions.disabled': '!model.image',
      },
    },
    {
      key: 'width',
      type: 'input-slider',
      templateOptions: {
        label: 'Width (px)',
        min: 10,
        max: 333,
      },
      expressionProperties: {
        'templateOptions.disabled': '!model.seats',
      },
    },
    {
      key: 'height',
      type: 'input-slider',
      templateOptions: {
        label: 'Height (px)',
        min: 10,
        max: 333,
      },
      expressionProperties: {
        'templateOptions.disabled': '!model.seats',
      },
    },
    {
      key: 'rounded',
      type: 'input-slider',
      templateOptions: {
        label: 'Rounded (%)',
        max: 50,
      },
      expressionProperties: {
        'templateOptions.disabled': '!model.seats',
      },
    },
  ];

  seatForm: FormGroup<Dimension>;
  seatModel!: Dimension;
  seatFields: FormlyFieldConfig[] = [
    {
      key: 'width',
      type: 'input-slider',
      templateOptions: {
        label: 'Width (px)',
        min: 10,
        max: 333,
      },
    },
    {
      key: 'height',
      type: 'input-slider',
      templateOptions: {
        label: 'Height (px)',
        min: 10,
        max: 333,
      },
    },
    {
      key: 'rounded',
      type: 'input-slider',
      templateOptions: {
        label: 'Rounded (%)',
        max: 50,
      },
    },
  ];

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private context: TuiDialogContext<Partial<SeatZone> | undefined, Partial<SeatZone> | undefined>,
    private fb: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private destroy$: TuiDestroyService
  ) {
    this.form = fb.group({ office: '', name: '', image: '', seats: 0, width: 40, height: 40, rounded: 0 });
    this.seatForm = fb.group({ width: 40, height: 40, rounded: 0 });
  }

  ngAfterViewInit(): void {
    if (this.context.data) {
      const { name, imageUrl } = this.context.data;
      this.form.patchValue({ name });
      if (imageUrl) this.model.image = imageUrl;
      this.title = 'editRoom';
    } else this.title = 'addRoom';

    this.imageControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((file) => {
      if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.model.image = reader.result as string;
          this.changeDetector.detectChanges();
        };
      } else {
        this.form.controls.seats.setValue(0);
        this.model.image = '';
      }
    });

    this.form.controls.seats.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.seats = Array.from(
        { length: value },
        (_, index) =>
          this.seats[index] || {
            positionX: Math.floor(Math.random() * (90 - 10) + 10),
            positionY: Math.floor(Math.random() * (90 - 10) + 10),
          }
      );
      if (!value) this.current = -1;
      else this.onFocus(value - 1);
    });

    keys.forEach((key) => {
      this.form.controls[key].valueChanges
        .pipe(startWith(this.model[key]), takeUntil(this.destroy$))
        .subscribe((value) => {
          this.dimension[key] = value / this.factor[key];
          this.updateSeatForm();
        });
    });

    keys.forEach((key) => {
      this.seatForm.controls[key].valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
        if (this.current !== -1) {
          if (value !== this.model[key] || this.seats[this.current][key] !== undefined) {
            keys.forEach((key) => {
              if (this.seats[this.current][key] === undefined)
                this.seats[this.current][key] = this.model[key] / this.factor[key];
            });
            this.seats[this.current][key] = value / this.factor[key];
          }
        }
      });
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
    if (this.keepFocus) this.keepFocus = false;
    else {
      const paths = path.map((e) => e.nodeName);
      if (paths.includes('ARTICLE')) {
        if (!paths.includes('BUTTON')) this.current = -1;
      } else if (!paths.includes('FORMLY-FORM')) this.current = -1;
    }
  }

  @HostListener('window:keydown', ['$event'])
  moveByArrowKey(event: KeyboardEvent) {
    if (this.current !== -1) {
      if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        event.preventDefault();
        const distanceObj = { x: 0, y: 0 };
        if (event.key === 'ArrowLeft') distanceObj.x = -1;
        if (event.key === 'ArrowRight') distanceObj.x = 1;
        if (event.key === 'ArrowUp') distanceObj.y = -1;
        if (event.key === 'ArrowDown') distanceObj.y = 1;
        this.moveSeat(this.current, distanceObj);
      }
    }
  }

  updateFactor(): void {
    if (!this.model.seats) this.form.patchValue({ seats: 1 });
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

  onFocus(index: number): void {
    this.current = index;
    this.updateSeatForm();
  }

  onReset(): void {
    this.keepFocus = true;
    keys.forEach((key) => {
      delete this.seats[this.current][key];
    });
    this.updateSeatForm();
  }

  updateSeatForm(): void {
    if (this.current !== -1) {
      const width = Math.round((this.seats[this.current].width || this.dimension.width) * this.factor.width);
      const height = Math.round((this.seats[this.current].height || this.dimension.height) * this.factor.height);
      const rounded =
        this.seats[this.current].rounded !== undefined
          ? (this.seats[this.current].rounded as number)
          : this.model.rounded;
      this.seatModel = { width, height, rounded };
    }
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

  cancel(): void {
    this.context.completeWith(undefined);
  }

  save(): void {
    this.context.completeWith({
      name: this.model.name,
      office: { id: this.model.office },
      imageUrl: this.model.image,
      seats: this.seats.map((seat) => ({ style: JSON.stringify(seat) })),
    });
  }
}
