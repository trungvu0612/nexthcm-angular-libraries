import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Dimension, PromptService, Seat, UploadFileService, Zone } from '@nexthcm/cdk';
import { FormBuilder, FormGroup } from '@ngneat/reactive-forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { iif, Observable, of } from 'rxjs';
import { startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { AdminSeatMapsService } from '../../services/admin-seat-maps.service';

interface SeatMapForm extends Dimension {
  office: Partial<Zone> | null;
  name: string;
  imageUrl: string;
  dimensionX: number;
  dimensionY: number;
  seats: number;
}

const keys: ('width' | 'height' | 'rounded')[] = ['width', 'height', 'rounded'];

@Component({
  selector: 'hcm-upsert-seat-map-',
  templateUrl: './upsert-seat-map.component.html',
  styleUrls: ['./upsert-seat-map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class UpsertSeatMapComponent implements AfterViewInit {
  @ViewChild('zone') zone!: ElementRef;
  sign$: Observable<Partial<Zone>>;
  seatMap!: Partial<Zone>;
  offices$ = this.adminSeatMapsService.select('offices');
  keepFocus = false;
  current = -1;
  first = true;
  factor = { width: 0, height: 0, rounded: 1 };
  dimension = { width: 0, height: 0, rounded: 0 };
  seats: Seat[] = [];
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
      fieldGroupClassName: 'grid grid-flow-col grid-rows-3 gap-x-10 gap-y-2 mb-4',
      fieldGroup: [
        {
          key: 'office',
          type: 'combo-box',
          templateOptions: {
            required: true,
            translate: true,
            label: 'office',
            placeholder: 'chooseOffice',
            textfieldSize: 'm',
            textfieldLabelOutside: true,
            serverRequest: (searchQuery: string) => this.adminSeatMapsService.getOfficesSearch(searchQuery),
          },
        },
        {
          key: 'name',
          type: 'input',
          templateOptions: {
            required: true,
            translate: true,
            label: 'name',
            placeholder: 'enterName',
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
          expressionProperties: { 'templateOptions.disabled': '!model.imageUrl' },
        },
        {
          key: 'width',
          type: 'input-slider',
          templateOptions: { label: 'Width (px)', min: 10, max: 333 },
          expressionProperties: { 'templateOptions.disabled': '!model.seats' },
        },
        {
          key: 'height',
          type: 'input-slider',
          templateOptions: { label: 'Height (px)', min: 10, max: 333 },
          expressionProperties: { 'templateOptions.disabled': '!model.seats' },
        },
        {
          key: 'rounded',
          type: 'input-slider',
          templateOptions: { label: 'Rounded (%)', max: 50 },
          expressionProperties: { 'templateOptions.disabled': '!model.seats' },
        },
      ],
    },
    {
      key: 'imageUrl',
      type: 'upload-file',
      templateOptions: {
        required: true,
        translate: true,
        linkText: 'chooseAnImage',
        labelText: 'orDropItHere',
        accept: 'image/*',
        serverRequest: (file: File) => this.uploadFileService.uploadFile('admin-tenant/domain', file),
      },
    },
  ];

  seatForm: FormGroup<Dimension>;
  seatModel: Dimension = { width: 40, height: 40, rounded: 0 };
  seatFields: FormlyFieldConfig[] = [
    {
      key: 'width',
      type: 'input-slider',
      templateOptions: { label: 'Width (px)', min: 10, max: 333 },
    },
    {
      key: 'height',
      type: 'input-slider',
      templateOptions: { label: 'Height (px)', min: 10, max: 333 },
    },
    {
      key: 'rounded',
      type: 'input-slider',
      templateOptions: { label: 'Rounded (%)', max: 50 },
    },
  ];

  constructor(
    private readonly adminSeatMapsService: AdminSeatMapsService,
    private readonly uploadFileService: UploadFileService,
    private readonly router: Router,
    private readonly destroy$: TuiDestroyService,
    private promptService: PromptService,
    fb: FormBuilder,
    route: ActivatedRoute
  ) {
    this.form = fb.group(this.model);
    this.seatForm = fb.group(this.seatModel);
    this.sign$ = iif(
      () => route.snapshot.params.id,
      this.adminSeatMapsService.getSeatMap(route.snapshot.params.id),
      of({})
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
    if (this.first && this.seatMap.id) {
      this.first = false;
      if (this.seatMap.seats) {
        this.seats = this.seatMap.seats.map((seat) => {
          return Object.assign(seat, JSON.parse(seat.style || '{}'));
        });
        this.form.patchValue({ seats: this.seats.length });
      }
    }
    if (!this.seats.length) this.form.patchValue({ seats: 1 });
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

  submitSeatMap(): void {
    if (this.form.valid) {
      if (!this.seatMap.type) this.seatMap.type = 'UNSET';
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
      Object.assign(this.seatMap, { office, name, imageUrl, dimensionX, dimensionY, seats });
      this.adminSeatMapsService[this.seatMap.id ? 'editSeatMap' : 'createSeatMap'](this.seatMap)
        .pipe(switchMap(() => this.promptService.open({ icon: 'success', text: 'Successfully!' } as SweetAlertOptions)))
        .subscribe(() => this.router.navigateByUrl('/admin/seat-maps'));
    }
  }
}
