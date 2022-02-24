import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions } from '@datorama/akita-ng-effects';
import {
  Dimension,
  loadOffices,
  OfficesQuery,
  PromptService,
  Seat,
  SeatMap,
  StyleSeat,
  UploadFileService,
} from '@nexthcm/cdk';
import { SeatMapsService } from '@nexthcm/seat-maps';
import { FormBuilder } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { setProp } from '@rx-angular/state';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { iif, Observable, of } from 'rxjs';
import { distinctUntilChanged, startWith, takeUntil, tap } from 'rxjs/operators';

import { AdminSeatMapsService } from '../../services/admin-seat-maps.service';
import { TRANSLATION_SCOPE } from '../../translation-scope';

interface SeatMapForm extends SeatMap {
  numberOfSeats: number;
  width: number;
  height: number;
  rounded: number;
}

const DIMENSION_KEYS: (keyof Dimension)[] = ['width', 'height', 'rounded'];

@Component({
  selector: 'hcm-upsert-seat-map-',
  templateUrl: './upsert-seat-map.component.html',
  styleUrls: ['./upsert-seat-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UpsertSeatMapComponent implements AfterViewInit {
  @ViewChild('zone') zone?: ElementRef;
  sign$: Observable<SeatMap>;
  seatMap = {} as SeatMap;
  keepFocus = false;
  current = -1;
  initial = true;
  factor = { width: 0, height: 0, rounded: 1 };
  dimension = { width: 0, height: 0, rounded: 0 };
  seats: Seat[] = [];
  model = {
    name: '',
    imageUrl: '',
    dimensionX: 0,
    dimensionY: 0,
    numberOfSeats: 0,
    width: 40,
    height: 40,
    rounded: 0,
  } as SeatMapForm;
  form = this.fb.group<SeatMapForm>(this.model);
  fields: FormlyFieldConfig[] = [
    {
      className: 'tui-form__row block',
      fieldGroupClassName: 'grid grid-cols-3',
      fieldGroup: [
        {
          className: 'col-span-2 border-r pr-4',
          fieldGroup: [
            {
              key: 'office',
              className: 'tui-form__row block',
              type: 'select',
              templateOptions: {
                translate: true,
                label: 'office',
                labelClassName: 'font-semibold',
                options: this.officesQuery.selectAll(),
                placeholder: 'chooseOffice',
                labelProp: 'name',
                matcherBy: 'id',
                textfieldLabelOutside: true,
                required: true,
              },
            },
            {
              key: 'name',
              className: 'tui-form__row block',
              type: 'input',
              templateOptions: {
                required: true,
                translate: true,
                label: 'name',
                labelClassName: 'font-semibold',
                placeholder: 'enterName',
                textfieldLabelOutside: true,
              },
            },
            {
              key: 'numberOfSeats',
              className: 'tui-form__row block',
              type: 'input-count',
              templateOptions: {
                labelClassName: 'font-semibold',
                label: 'numberOfSeats',
                translate: true,
                textfieldLabelOutside: true,
              },
            },
          ],
        },
        {
          className: 'pl-4',
          fieldGroup: [
            {
              key: 'width',
              className: 'tui-form__row block',
              type: 'input-slider',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.width`,
                min: 10,
                max: 333,
                labelClassName: 'font-semibold',
              },
            },
            {
              key: 'height',
              className: 'tui-form__row block',
              type: 'input-slider',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.height`,
                min: 10,
                max: 333,
                labelClassName: 'font-semibold',
              },
            },
            {
              key: 'rounded',
              className: 'tui-form__row block',
              type: 'input-slider',
              templateOptions: {
                translate: true,
                label: `${TRANSLATION_SCOPE}.rounded`,
                max: 50,
                labelClassName: 'font-semibold',
              },
            },
          ],
        },
      ],
    },
    {
      key: 'imageUrl',
      className: 'tui-form__row block',
      type: 'upload-file',
      templateOptions: {
        required: true,
        translate: true,
        label: 'image',
        labelClassName: 'font-semibold',
        linkText: 'chooseAnImage',
        labelText: 'orDropItHere',
        accept: 'image/*',
        serverRequest: (file: File) => this.uploadFileService.uploadFile('admin-tenant/domain', file, true),
      },
    },
    { key: 'type', defaultValue: 'UNSET' },
    { key: 'id' },
  ];

  seatModel: Dimension = { width: 40, height: 40, rounded: 0 };
  seatForm = this.fb.group<Dimension>(this.seatModel);
  seatFields: FormlyFieldConfig[] = [
    {
      key: 'width',
      type: 'input-slider',
      defaultValue: 40,
      templateOptions: {
        translate: true,
        label: `${TRANSLATION_SCOPE}.width`,
        min: 10,
        max: 333,
        labelClassName: 'font-semibold',
      },
    },
    {
      key: 'height',
      type: 'input-slider',
      defaultValue: 40,
      templateOptions: {
        translate: true,
        label: `${TRANSLATION_SCOPE}.height`,
        min: 10,
        max: 333,
        labelClassName: 'font-semibold',
      },
    },
    {
      key: 'rounded',
      type: 'input-slider',
      templateOptions: {
        translate: true,
        label: `${TRANSLATION_SCOPE}.rounded`,
        max: 50,
        labelClassName: 'font-semibold',
      },
    },
    { key: 'id' },
    { key: 'type' },
  ];

  constructor(
    private readonly seatMapsService: SeatMapsService,
    private readonly adminSeatMapsService: AdminSeatMapsService,
    private readonly uploadFileService: UploadFileService,
    private readonly router: Router,
    private readonly destroy$: TuiDestroyService,
    private readonly promptService: PromptService,
    private readonly fb: FormBuilder,
    private readonly officesQuery: OfficesQuery,
    route: ActivatedRoute,
    actions: Actions
  ) {
    actions.dispatch(loadOffices());
    this.sign$ = iif(
      () => route.snapshot.params.seatMapId,
      this.seatMapsService.getSeatMap(route.snapshot.params.seatMapId),
      of({} as SeatMap)
    ).pipe(
      tap((data) => {
        this.seatMap = data;
        if (data.id) {
          const { name, office, imageUrl } = data;
          Object.assign(this.model, { name, office, imageUrl });
        }
      })
    );
  }

  ngAfterViewInit(): void {
    this.form.controls.numberOfSeats.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
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

    DIMENSION_KEYS.forEach((key) => {
      this.handleGeneralDimension(key);
      this.handleSeatDimension(key);
    });
  }

  @HostListener('window:resize') onResize(): void {
    this.updateFactor();
    DIMENSION_KEYS.forEach((key) => {
      if (this.dimension[key]) {
        this.form.controls[key].patchValue(this.dimension[key] * this.factor[key], { emitEvent: false });
      }
    });
    this.updateSeatForm();
  }

  @HostListener('window:click', ['$event.path']) clickEvent(path: HTMLElement[]): void {
    if (this.keepFocus) this.keepFocus = false;
    else {
      const paths = path.map((e) => e.nodeName);
      if (paths.includes('ARTICLE')) {
        if (!paths.includes('BUTTON')) this.current = -1;
      } else if (!paths.includes('FORMLY-FORM')) this.current = -1;
    }
  }

  @HostListener('window:keydown', ['$event']) moveByArrowKey(event: KeyboardEvent): void {
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
    DIMENSION_KEYS.forEach((key) => {
      if (this.factor[key]) {
        this.dimension[key] = this.form.value[key] / this.factor[key];
      }
    });
    if (this.initial && this.seatMap.id) {
      this.initial = false;
      if (this.seatMap.seats) {
        this.seats = this.seatMap.seats.map((seat) => Object.assign(seat, seat.style as StyleSeat));
        this.form.patchValue({ numberOfSeats: this.seats.length });
      }
    }
    if (!this.seats.length) this.form.patchValue({ numberOfSeats: 1 });
  }

  updateFactor(): void {
    if (this.zone)
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
    DIMENSION_KEYS.forEach((key) => delete this.seats[this.current][key]);
    this.updateSeatForm();
  }

  deleteSeat(): void {
    this.keepFocus = true;
    this.seats.splice(this.current, 1);
    this.form.patchValue({ numberOfSeats: this.seats.length }, { emitEvent: false });
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

  submitSeatMap(): void {
    if (this.form.valid) {
      if (!this.seatMap.type) this.seatMap.type = 'UNSET';
      const { name, imageUrl, dimensionX, dimensionY, office } = this.model;
      const seats = this.seats.map((seat) => {
        const result = setProp<Partial<Seat>, keyof Seat>(seat, 'label', seat.label ?? '');
        result.style = JSON.stringify({
          positionX: seat.positionX,
          positionY: seat.positionY,
          width: seat.width ?? this.dimension.width,
          height: seat.height ?? this.dimension.height,
          rounded: seat.rounded ?? this.dimension.rounded,
        });
        delete result.positionX;
        delete result.positionY;
        delete result.width;
        delete result.height;
        delete result.rounded;
        return result;
      });
      Object.assign(this.seatMap, { office, name, imageUrl, dimensionX, dimensionY, seats });
      this.adminSeatMapsService
        .upsertSeatMap(this.seatMap)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          this.promptService.handleResponse(
            `adminSeatMaps.${this.seatMap.id ? 'editSeatMapSuccessfully' : 'addSeatMapSuccessfully'}`,
            () => {
              if (!this.seatMap.id) {
                this.router.navigate(['/admin/seat-maps']);
              }
            }
          )
        );
    }
  }

  private handleGeneralDimension(key: keyof Dimension): void {
    this.form.controls[key].valueChanges
      .pipe(startWith(this.model[key]), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        if (this.factor[key]) {
          this.dimension[key] = value / this.factor[key];
          this.updateSeatForm();
        }
      });
  }

  private handleSeatDimension(key: keyof Dimension): void {
    this.seatForm.controls[key].valueChanges
      .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((value) => {
        if (this.current !== -1) {
          if (value !== this.model[key] || this.seats[this.current][key] !== undefined) {
            DIMENSION_KEYS.forEach((key) => {
              if (this.seats[this.current][key] === undefined)
                this.seats[this.current][key] = this.model[key] / this.factor[key];
            });
            this.seats[this.current][key] = value / this.factor[key];
          }
        }
      });
  }
}
