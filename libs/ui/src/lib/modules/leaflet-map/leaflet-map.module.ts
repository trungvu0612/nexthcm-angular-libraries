import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FormlyModule } from '@ngx-formly/core';
import { FormFieldModule } from '../formly-taiga-ui';
import { FormlyLeafletCoordinatesComponent } from './formly-leaflet-coordinates/formly-leaflet-coordinates.component';

@NgModule({
  declarations: [FormlyLeafletCoordinatesComponent],
  imports: [
    CommonModule,
    LeafletModule,
    FormFieldModule,
    FormlyModule.forChild({
      types: [{ name: 'leaflet-coordinates', component: FormlyLeafletCoordinatesComponent, wrappers: ['form-field'] }],
    }),
  ],
})
export class LeafletMapModule {}
