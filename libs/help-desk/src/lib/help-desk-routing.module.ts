import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpDeskComponent } from './help-desk.component';

import { LayoutComponent } from '@nexthcm/ui';
import { SeatMapComponent } from './pages/seat-map/seat-map.component';
import { BvCalendarComponent } from './pages/bv-calendar/bv-calendar.component';
import { AuthGuard } from '@nexthcm/auth';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: HelpDeskComponent,
        children: [{ path: 'seat-map', component: SeatMapComponent },
          { path: 'bv-calendar', component: BvCalendarComponent }]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpDeskRoutingModule {}

