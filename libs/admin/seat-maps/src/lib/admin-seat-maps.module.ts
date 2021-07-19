import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeatMapListComponent } from './pages/seat-map-list/seat-map-list.component';
import { TranslocoModule } from '@ngneat/transloco';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';
import { TableModule } from 'ngx-easy-table';
import { UpsertSeatMapComponent } from './pages/upsert-seat-map/upsert-seat-map.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';
import { TuiInputFileModule } from '@taiga-ui/kit';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GetFileModule, LayoutComponent, PromptComponentModule } from '@nexthcm/ui';
import { AdminSeatMapsService } from './services/admin-seat-maps.service';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@nexthcm/auth';
import { TuiLetModule } from '@taiga-ui/cdk';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: SeatMapListComponent },
      { path: 'create', component: UpsertSeatMapComponent },
      { path: 'edit/:id', component: UpsertSeatMapComponent },
    ],
  },
];

@NgModule({
  declarations: [SeatMapListComponent, UpsertSeatMapComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslocoModule,
    TuiButtonModule,
    TableModule,
    ReactiveFormsModule,
    FormlyModule,
    TuiInputFileModule,
    DragDropModule,
    TuiSvgModule,
    GetFileModule,
    PromptComponentModule,
    TuiTablePaginationModule,
    TuiLetModule,
  ],
  providers: [AdminSeatMapsService],
})
export class AdminSeatMapsModule {}
