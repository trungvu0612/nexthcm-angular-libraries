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
          { path: '', pathMatch: 'full', redirectTo: 'policies' },
          { path: 'policies', component: PoliciesComponent },
          { path: 'policies/:id', component: PolicyDetailComponent },
          { path: 'updated', component: UpdatedComponent }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolicyRoutingModule {
}
