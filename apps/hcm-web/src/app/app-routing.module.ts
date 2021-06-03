import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
  import { LoginComponent } from '@nexthcm/auth';

const routes: Routes = [
  { path: 'auth', component: LoginComponent },
  { path: '', loadChildren: () => import('@nexthcm/home').then((m) => m.HomeModule) },
  { path: 'my-time', loadChildren: () => import('@nexthcm/my-time').then((m) => m.MyTimeModule) },
  { path: 'help-desk', loadChildren: () => import('@nexthcm/help-desk').then((m) => m.HelpDeskModule) },
  { path: 'human-resource', loadChildren: () => import('@nexthcm/human-resource').then((m) => m.HumanResourceModule) },
  { path: 'policy', loadChildren: () => import('@nexthcm/policy').then((m) => m.PolicyModule) },
  { path: 'admin-employee', loadChildren: () => import('@nexthcm/admin-employee').then((m) => m.AdminEmployeeModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { initialNavigation: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
