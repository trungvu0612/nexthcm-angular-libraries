import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { GetFileModule, LayoutComponent } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDropdownControllerModule,
  TuiHostedDropdownModule,
  TuiLoaderModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { TuiAvatarModule } from '@taiga-ui/kit';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { SeatComponent } from './components/seat/seat.component';
import { SeatMapsComponent } from './seat-maps.component';
import { SeatMapsService } from './seat-maps.service';

export const SEAT_MAPS_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_HELP_DESK', redirectTo: '/' } },
    children: [{ path: '', component: SeatMapsComponent }],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SEAT_MAPS_ROUTES),
    TuiSvgModule,
    ReactiveFormsModule,
    FormlyModule,
    TuiLetModule,
    TuiLoaderModule,
    DragDropModule,
    GetFileModule,
    TranslocoModule,
    TuiHostedDropdownModule,
    TuiDropdownControllerModule,
    TuiAvatarModule,
    TuiButtonModule,
  ],
  declarations: [SeatMapsComponent, SeatComponent],
  providers: [SeatMapsService],
})
export class SeatMapsModule {}
