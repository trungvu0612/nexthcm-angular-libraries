import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '@nexthcm/ui';
import { AdminOfficesComponent } from './admin-offices.component';
import { OfficesComponent } from './pages/offices/offices.component';
import { SeatMapsComponent } from './pages/seat-maps/seat-maps.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: AdminOfficesComponent,
        children: [
          { path: '', component: OfficesComponent },
          { path: 'seat-maps', component: SeatMapsComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminOfficesRoutingModule {}
