import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from '@nexthcm/ui';
import { AdminOfficesComponent } from './admin-offices.component';
import { OfficesComponent } from './pages/offices/offices.component';
import { RoomsComponent } from './pages/rooms/rooms.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        component: AdminOfficesComponent,
        children: [
          { path: '', component: OfficesComponent },
          { path: 'rooms', component: RoomsComponent },
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
