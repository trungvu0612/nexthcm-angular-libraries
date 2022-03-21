import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { GetFilePipeModule } from '@nexthcm/cdk';
import { LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule, TuiSvgModule } from '@taiga-ui/core';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard, NgxPermissionsModule } from 'ngx-permissions';

import en from './i18n/en.json';
import vi from './i18n/vi.json';
import { SeatMapManagementComponent } from './pages/seat-map-management/seat-map-management.component';
import { UpsertSeatMapComponent } from './pages/upsert-seat-map/upsert-seat-map.component';
import { AdminSeatMapsService } from './services/admin-seat-maps.service';

export const adminSeatMapsRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_SEAT_MAP', redirectTo: '/' } },
    children: [
      { path: '', component: SeatMapManagementComponent },
      {
        path: 'create',
        component: UpsertSeatMapComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'CREATE_SEAT_MAP', redirectTo: '/' } },
      },
      {
        path: ':seatMapId/edit',
        component: UpsertSeatMapComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'UPDATE_SEAT_MAP', redirectTo: '/' } },
      },
    ],
  },
];

@NgModule({
  declarations: [SeatMapManagementComponent, UpsertSeatMapComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(adminSeatMapsRoutes),
    DragDropModule,
    GetFilePipeModule,
    LayoutModule,
    ReactiveFormsModule,
    TranslocoModule,
    FormlyModule,
    TableModule,
    TuiButtonModule,
    TuiSvgModule,
    TuiTablePaginationModule,
    TuiLoaderModule,
    NgxPermissionsModule,
    TuiLetModule,
    PushModule,
  ],
  providers: [
    AdminSeatMapsService,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: { scope: 'adminSeatMaps', loader: { en: () => Promise.resolve(en), vi: () => Promise.resolve(vi) } },
    },
  ],
})
export class AdminSeatMapsModule {}
