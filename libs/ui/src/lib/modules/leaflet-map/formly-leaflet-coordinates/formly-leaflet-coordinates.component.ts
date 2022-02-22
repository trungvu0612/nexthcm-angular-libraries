import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { FieldType } from '@ngx-formly/core';
import { TuiDestroyService } from '@taiga-ui/cdk';
import {
  Icon,
  icon,
  latLng,
  LatLngExpression,
  LeafletMouseEvent,
  Map,
  MapOptions,
  Marker,
  marker,
  tileLayer,
} from 'leaflet';
import { geocoder } from 'leaflet-control-geocoder';
import { OpenStreetMapProvider, SearchControl } from 'leaflet-geosearch';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'hcm-formly-leaflet-coordinates',
  templateUrl: './formly-leaflet-coordinates.component.html',
  styleUrls: ['./formly-leaflet-coordinates.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormlyLeafletCoordinatesComponent extends FieldType implements AfterViewInit, OnDestroy {
  readonly mapOptions: MapOptions = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        detectRetina: true,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
      }),
    ],
    zoom: 14,
    center: latLng(10.762622, 106.660172),
  };
  private readonly geoCoder = geocoder();
  private readonly searchControl = SearchControl({
    provider: new OpenStreetMapProvider({}),
    notFoundMessage: 'Could not find location.',
    style: 'bar',
    showPopUp: false,
    showMarker: false,
  });
  private marker?: Marker;
  private map?: Map;

  constructor(private readonly destroy$: TuiDestroyService) {
    super();
  }

  ngAfterViewInit(): void {
    this.formControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (this.map) {
        this.createMarker(latLng(value));
        this.map.setView(latLng(value));
      }
    });
  }

  ngOnDestroy(): void {
    this.map?.clearAllEventListeners();
    this.map?.invalidateSize();
  }

  onMapReady(map: Map): void {
    this.map = map;
    this.map.addControl(this.searchControl);
    if (this.formControl.value) {
      this.createMarker(latLng(this.formControl.value));
      this.map.setView(latLng(this.formControl.value));
    }

    this.map.on('click', ({ latlng }: LeafletMouseEvent) => {
      this.createMarker(latlng);
      if (this.geoCoder.options.geocoder?.reverse) {
        this.geoCoder.options.geocoder.reverse(latlng, map.options.crs?.scale(map.getZoom()) || 1, (result) => {
          if (result.length && this.to.onReverseLocation) {
            this.to.onReverseLocation(result[0].name, latlng.lat, latlng.lng);
          }
        });
      }
    });

    this.map.on('geosearch/showlocation', (result: any) => {
      const { label, x: lng, y: lat }: { label: string; x: number; y: number } = result.location;

      this.createMarker(latLng(lat, lng));
      if (this.to.onReverseLocation) {
        this.to.onReverseLocation(label, lat, lng);
      }
    });
  }

  private createMarker(latLng: LatLngExpression): void {
    if (this.marker && this.map?.hasLayer(this.marker)) {
      this.map.removeLayer(this.marker);
    }
    this.marker = marker(latLng, {
      icon: icon({
        ...Icon.Default.prototype.options,
        iconUrl: 'assets/marker-icon.png',
        iconRetinaUrl: 'assets/marker-icon-2x.png',
        shadowUrl: 'assets/marker-shadow.png',
      }),
    }).addTo(this.map as Map);
  }
}
