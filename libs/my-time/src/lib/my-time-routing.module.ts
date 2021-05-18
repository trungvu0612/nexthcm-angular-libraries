import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyTimeComponent } from './my-time.component';
import { MyLeaveComponent } from './pages/my-leave/my-leave.component';
import { MyRequestComponent } from './pages/my-request/my-request.component';

const routes: Routes = [
  {
    path: '',
    component: MyTimeComponent,
    children: [
      { path: '', component: MyLeaveComponent },
      { path: 'request', component: MyRequestComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyTimeRoutingModule {}

