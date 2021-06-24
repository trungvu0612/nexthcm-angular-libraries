import { CdkDragEnd } from '@angular/cdk/drag-drop';
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
import { Dimension, filterBySearch, Seat, UploadFileService, Zone } from '@nexthcm/ui';
import { FormBuilder, FormControl, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Observable } from 'rxjs';
import { map, shareReplay, startWith, takeUntil } from 'rxjs/operators';
import { SeatMapForm } from '../../models/offices';
import { AdminOfficesService } from '../../services/admin-offices.service';

const keys: ('width' | 'height' | 'rounded')[] = ['width', 'height', 'rounded'];

@Component({
  selector: 'hcm-seat-map-dialog',
  templateUrl: './seat-map-dialog.component.html',
  styleUrls: ['./seat-map-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class SeatMapDialogComponent implements AfterViewInit {
  @ViewChild('zone') zone!: ElementRef;
  title!: string;
  imageControl = new FormControl<File>();
  keepFocus = false;
  current = -1;
  first = true;
  factor = { width: 0, height: 0, rounded: 1 };
  dimension = { width: 0, height: 0, rounded: 0 };
  seats: Seat[] = [];
  offices$ = this.adminOfficesService.getZoneData('office', { size: 999 }).pipe(shareReplay(1));

  form: FormGroup<SeatMapForm>;
  model: SeatMapForm = {
    office: null,
    name: '',
    imageUrl: '',
    dimensionX: 0,
    dimensionY: 0,
    seats: 0,
    width: 40,
    height: 40,
    rounded: 0,
  };
  fields: FormlyFieldConfig[] = [
    {
      key: 'office',
      type: 'combo-box',
      templateOptions: {
        label: 'office',
        translate: true,
        required: true,
        textfieldSize: 'm',
        serverRequest: (search: string): Observable<Partial<Zone>[]> =>
          this.offices$.pipe(map((data) => filterBySearch(data.items, search))),
      },
    },
    {
      key: 'name',
      type: 'input',
      templateOptions: {
        label: 'seatMap',
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
        textfieldSize: 'm',
        textfieldLabelOutside: true,
      },
      expressionProperties: {
        'templateOptions.disabled': '!model.imageUrl',
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
  seatModel: Dimension = { width: 40, height: 40, rounded: 0 };
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
    private context: TuiDialogContext<Partial<Zone> | undefined, Partial<Zone> | undefined>,
    private adminOfficesService: AdminOfficesService,
    private uploadFileService: UploadFileService,
    private fb: FormBuilder,
    private changeDetector: ChangeDetectorRef,
    private destroy$: TuiDestroyService
  ) {
    this.form = fb.group(this.model);
    this.seatForm = fb.group(this.seatModel);
    this.offices$.subscribe();
  }

  ngAfterViewInit(): void {
    if (this.context.data) {
      const { name, imageUrl, office } = this.context.data;
      if (name) this.form.patchValue({ name });
      if (office) this.form.patchValue({ office });
      if (imageUrl) this.model.imageUrl = imageUrl;
      this.title = 'editSeatMap';
    } else this.title = 'addSeatMap';

    this.imageControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((file) => {
      if (file) {
        this.uploadFileService.uploadFile(file, 'seats-map').subscribe((imageUrl) => {
          this.model.imageUrl = imageUrl;
          this.changeDetector.detectChanges();
        });
      } else {
        this.form.controls.seats.setValue(0);
        this.model.imageUrl = '';
      }
    });

    this.form.controls.seats.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.seats = Array.from(
        { length: value },
        (_, index) =>
          this.seats[index] || {
            positionX: Math.floor(Math.random() * (55 - 45) + 45),
            positionY: Math.floor(Math.random() * (55 - 45) + 45),
          }
      );
      if (!value) this.current = -1;
      else this.focusSeat(value - 1);
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

  onImageLoad(event: any): void {
    this.model.dimensionX = event.path[0].naturalWidth;
    this.model.dimensionY = event.path[0].naturalHeight;
    this.updateFactor();
    if (this.first && this.context.data) {
      this.first = false;
      if (this.context.data.seats) {
        this.seats = this.context.data.seats.map((seat) => {
          return Object.assign(seat, JSON.parse(seat.style || '{}'));
        });
        this.form.patchValue({ seats: this.seats.length });
      }
    }
    if (!this.seats.length) this.form.patchValue({ seats: 1 });
  }

  updateFactor(): void {
    this.factor = {
      width: this.zone.nativeElement.offsetWidth / 100,
      height: this.zone.nativeElement.offsetHeight / 100,
      rounded: 1,
    };
  }

  getRounded(rounded?: number): number {
    return typeof rounded === 'number' ? rounded : this.dimension.rounded;
  }

  focusSeat(index: number): void {
    this.current = index;
    this.updateSeatForm();
  }

  resetSeat(): void {
    this.keepFocus = true;
    keys.forEach((key) => {
      delete this.seats[this.current][key];
    });
    this.updateSeatForm();
  }

  deleteSeat(): void {
    this.keepFocus = true;
    this.seats.splice(this.current, 1);
    this.form.patchValue({ seats: this.seats.length }, { emitEvent: false });
    this.current = -1;
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
    const updateSeat = (
      key: 'positionX' | 'positionY',
      limitKey: 'width' | 'height',
      distance: number,
      factor: number
    ) => {
      const seat = this.seats[index];
      const limit = seat[limitKey] || this.dimension[limitKey];
      seat[key] += distance / factor;
      if (seat[key] > 100 - limit) seat[key] = 100 - limit;
      if (seat[key] < 0) seat[key] = 0;
    };
    updateSeat('positionX', 'width', distance.x, this.factor.width);
    updateSeat('positionY', 'height', distance.y, this.factor.height);
  }

  cancel(): void {
    this.context.completeWith(undefined);
  }

  save(): void {
    const seatMap: Partial<Zone> = this.context.data || {};
    if (!seatMap.type) seatMap.type = 'UNSET';
    const { name, imageUrl, dimensionX, dimensionY, office } = this.model;
    const seats: Partial<Seat>[] = this.seats;
    seats.forEach((seat) => {
      keys.forEach((key) => {
        if (seat[key] === undefined) seat[key] = this.dimension[key];
      });
      if (!seat.label) seat.label = '';
      const { positionX, positionY, width, height, rounded } = seat;
      seat.style = JSON.stringify({ positionX, positionY, width, height, rounded });
      delete seat.positionX;
      delete seat.positionY;
      delete seat.width;
      delete seat.height;
      delete seat.rounded;
    });
    Object.assign(seatMap, { office, name, imageUrl, dimensionX, dimensionY, seats });
    this.context.completeWith(seatMap);
  }
}
