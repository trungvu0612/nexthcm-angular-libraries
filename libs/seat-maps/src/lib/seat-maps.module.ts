import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { GetFilePipeModule } from '@nexthcm/cdk';
import { LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownControllerModule,
  TuiHostedDropdownModule,
  TuiLoaderModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { TuiAvatarModule, TuiComboBoxModule } from '@taiga-ui/kit';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { SeatComponent } from './components/seat/seat.component';
import { SeatMapsComponent } from './seat-maps.component';
import { SeatMapsService } from './seat-maps.service';
import { LetModule } from '@rx-angular/template';

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
    DragDropModule,
    GetFilePipeModule,
    LayoutModule,
    ReactiveFormsModule,
    TranslocoModule,
    FormlyModule,
    LetModule,
    TuiLoaderModule,
    TuiHostedDropdownModule,
    TuiDropdownControllerModule,
    TuiAvatarModule,
    TuiButtonModule,
    TuiComboBoxModule,
    TuiDataListModule,
    TuiSvgModule,
  ],
  declarations: [SeatMapsComponent, SeatComponent],
  providers: [SeatMapsService],
})
export class SeatMapsModule {}
