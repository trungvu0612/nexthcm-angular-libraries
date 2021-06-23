import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { AdminPoliciesComponent } from './admin-policies.component';
import { ListPoliciesComponent } from './pages/list-policies/list-policies.component';
import { UpsertPoliciesComponent } from './pages/upsert-policies/upsert-policies.component';
import { AdminLayoutComponent, FormlyTaigaUiModule } from '@nexthcm/ui';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiMarkerIconModule, TuiTagModule } from '@taiga-ui/kit';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from '@ngx-formly/core';

export const adminPoliciesRoutes: Route[] = [{
  path: '',
  component: AdminLayoutComponent,
  children: [
    {
      path: '',
      component: AdminPoliciesComponent,
      children: [
        { path: '', pathMatch: 'full', redirectTo: 'list' },
        { path: 'list', component: ListPoliciesComponent },
        { path: 'add', component: UpsertPoliciesComponent },
        { path: 'edit/:id', component: UpsertPoliciesComponent }
      ]
    }
  ]
}];

@NgModule({
  imports: [
    CommonModule,
    TuiTableModule,
    TuiTablePaginationModule,
    TuiButtonModule,
    TuiTagModule,
    FormlyModule,
    FormlyTaigaUiModule,
    TuiMarkerIconModule,
    ReactiveFormsModule,
    RouterModule.forChild(adminPoliciesRoutes),
    RouterModule
  ],
  declarations: [
    AdminPoliciesComponent,
    ListPoliciesComponent,
    UpsertPoliciesComponent
  ]
})
export class AdminPoliciesModule {
}
