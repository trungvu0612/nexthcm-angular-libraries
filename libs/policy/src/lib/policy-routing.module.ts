import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@nexthcm/auth';
import { LayoutComponent } from '@nexthcm/ui';
import { PolicyDetailComponent } from './pages/policy-detail/policy-detail.component';
import { PolicyComponent } from './pages/policy/policy.component';
import { UpdatedComponent } from './pages/updated/updated.component';
import { PolicyLayoutComponent } from './policy-layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: PolicyLayoutComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'policies' },
          { path: 'policies', component: PolicyComponent },
          { path: 'policies/:id', component: PolicyDetailComponent },
          { path: 'updated', component: UpdatedComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PolicyRoutingModule {}
