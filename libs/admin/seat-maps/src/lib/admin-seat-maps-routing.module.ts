import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@nexthcm/auth';
import { LayoutComponent } from '@nexthcm/ui';
import { SeatMapsComponent } from './admin-seat-maps.component';
import { SeatMapListComponent } from './pages/seat-map-list/seat-map-list.component';
import { UpsertSeatMapComponent } from './pages/seat-map-dialog/upsert-seat-map.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: SeatMapsComponent,
        children: [
          { path: '', component: SeatMapListComponent },
          { path: 'add', component: UpsertSeatMapComponent },
          { path: 'edit/:id', component: UpsertSeatMapComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminTenantRoutingModule {}
