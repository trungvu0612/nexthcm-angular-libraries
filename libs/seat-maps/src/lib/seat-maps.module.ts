import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { GetFilePipeModule } from '@nexthcm/cdk';
import {
  AvatarComponentModule,
  BaseFormComponentModule,
  BasicFilterComponentModule,
  FormlyUserComboBoxComponentModule,
  LayoutComponent,
  LayoutModule,
  SelectFilterComponentModule,
} from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { FormlyModule } from '@ngx-formly/core';
import { LetModule, PushModule } from '@rx-angular/template';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownControllerModule,
  TuiHostedDropdownModule,
  TuiLoaderModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiAvatarModule,
  TuiBadgeModule,
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiDropdownHoverModule,
  TuiIslandModule,
  TuiSelectModule,
} from '@taiga-ui/kit';
import { NgxPermissionsGuard, NgxPermissionsModule } from 'ngx-permissions';

import { SeatComponent } from './components/seat/seat.component';
import { SeatUserStatePipe } from './pipes/seat-user-state.pipe';
import { SeatMapsComponent } from './seat-maps.component';

export const SEAT_MAPS_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_SEAT', redirectTo: '/' } },
    children: [
      { path: '', component: SeatMapsComponent },
      { path: ':seatMapId', component: SeatMapsComponent },
    ],
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
    FormlyUserComboBoxComponentModule,
    NgxPermissionsModule,
    TuiSelectModule,
    BaseFormComponentModule,
    TranslocoLocaleModule,
    AvatarComponentModule,
    TuiTextfieldControllerModule,
    TuiLetModule,
    TuiBadgeModule,
    TuiIslandModule,
    BasicFilterComponentModule,
    SelectFilterComponentModule,
    FormsModule,
    TuiDataListWrapperModule,
    TuiDropdownHoverModule,
    PushModule,
  ],
  declarations: [SeatMapsComponent, SeatComponent, SeatUserStatePipe],
})
export class SeatMapsModule {}
