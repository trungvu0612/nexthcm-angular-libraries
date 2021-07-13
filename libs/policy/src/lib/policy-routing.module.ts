import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@nexthcm/auth';
import { LayoutComponent } from '@nexthcm/ui';
import { PoliciesComponent } from './pages/policies/policies.component';
import { PolicyDetailComponent } from './pages/policy-detail/policy-detail.component';
import { UpdatedComponent } from './pages/updated/updated.component';
import { PolicyComponent } from './policy.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: PolicyComponent,
        children: [
          { path: '', component: PoliciesComponent },
          { path: 'updated', component: UpdatedComponent },
          { path: ':id', component: PolicyDetailComponent },
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
