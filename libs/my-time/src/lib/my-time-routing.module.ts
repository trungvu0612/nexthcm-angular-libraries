import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyTimeComponent } from './my-time.component';
import { LayoutComponent } from '@nexthcm/ui';
import { WorkingHourComponent } from './pages/working-hour/working-hour.component';
import { MyRequestComponent } from './pages/my-request/my-request.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: MyTimeComponent,
        children: [
          { path: 'request', component: MyRequestComponent },
          { path: 'working-hour', component: WorkingHourComponent },
          { path: '', pathMatch: 'full', redirectTo: 'leave' },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyTimeRoutingModule {}
