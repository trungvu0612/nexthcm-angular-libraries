import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { GetFileModule } from '@nexthcm/cdk';
import { LayoutComponent } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiInputFileModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { SeatMapListComponent } from './pages/seat-map-list/seat-map-list.component';
import { UpsertSeatMapComponent } from './pages/upsert-seat-map/upsert-seat-map.component';
import { AdminSeatMapsService } from './services/admin-seat-maps.service';

export const adminSeatMapsRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_SEAT_MAP', redirectTo: '/' } },
    children: [
      { path: '', component: SeatMapListComponent },
      {
        path: 'create',
        component: UpsertSeatMapComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'CREATE_SEAT_MAP', redirectTo: '/' } },
      },
      {
        path: 'edit/:id',
        component: UpsertSeatMapComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'UPDATE_SEAT_MAP', redirectTo: '/' } },
      },
    ],
  },
];

@NgModule({
  declarations: [SeatMapListComponent, UpsertSeatMapComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(adminSeatMapsRoutes),
    TranslocoModule,
    TuiButtonModule,
    TableModule,
    ReactiveFormsModule,
    FormlyModule,
    TuiInputFileModule,
    DragDropModule,
    TuiSvgModule,
    GetFileModule,
    TuiTablePaginationModule,
    TuiLetModule,
  ],
  providers: [AdminSeatMapsService],
})
export class AdminSeatMapsModule {}
