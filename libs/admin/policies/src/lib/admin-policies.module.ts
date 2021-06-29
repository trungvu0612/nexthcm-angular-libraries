import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { AdminLayoutComponent, FormlyTaigaUiModule, PromptComponentModule } from '@nexthcm/ui';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiMarkerIconModule, TuiTagModule } from '@taiga-ui/kit';
import { AdminPoliciesComponent } from './admin-policies.component';
import { ListPoliciesComponent } from './pages/list-policies/list-policies.component';
import { UpsertPoliciesComponent } from './pages/upsert-policies/upsert-policies.component';
import { TableModule } from 'ngx-easy-table';
import { TranslocoModule } from '@ngneat/transloco';

export const adminPoliciesRoutes: Route[] = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        component: AdminPoliciesComponent,
        children: [
          { path: '', component: ListPoliciesComponent },
          { path: 'add', component: UpsertPoliciesComponent },
          { path: ':id/edit', component: UpsertPoliciesComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    TuiTableModule,
    TuiTablePaginationModule,
    TuiButtonModule,
    TuiTagModule,
    FormlyModule,
    PromptComponentModule,
    TableModule,
    TuiTablePaginationModule,
    TuiLoaderModule,
    FormlyTaigaUiModule,
    TuiMarkerIconModule,
    ReactiveFormsModule,
    TranslocoModule,
    RouterModule.forChild(adminPoliciesRoutes),
    RouterModule
  ],
  declarations: [AdminPoliciesComponent, ListPoliciesComponent, UpsertPoliciesComponent],
})
export class AdminPoliciesModule {}
