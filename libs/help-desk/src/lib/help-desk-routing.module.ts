import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HelpDeskComponent } from './help-desk.component';
import { LayoutComponent } from '@nexthcm/ui';
import { SeatMapComponent } from './pages/seat-map/seat-map.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: HelpDeskComponent,
        children: [{ path: 'seat-map', component: SeatMapComponent }],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelpDeskRoutingModule {}
