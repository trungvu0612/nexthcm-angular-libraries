import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { inlineLoaderFactory } from '@nexthcm/core';
import { FormlyTaigaUiModule, InputFilterComponentModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiMarkerIconModule, TuiTagModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AdminKnowledgeBaseService } from './admin-knowledge-base.service';
import { ListPoliciesComponent } from './pages/list-policies/list-policies.component';
import { UpsertPolicyComponent } from './pages/upsert-policy/upsert-policy.component';

export const adminKnowledgeBaseRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_ADMIN_KNOWLEDGE', redirectTo: '/' } },
    children: [
      { path: '', component: ListPoliciesComponent },
      {
        path: 'add',
        component: UpsertPolicyComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'CREATE_ADMIN_KNOWLEDGE', redirectTo: '/' } },
      },
      {
        path: ':id/edit',
        component: UpsertPolicyComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'UPDATE_ADMIN_KNOWLEDGE', redirectTo: '/' } },
      },
    ],
  },
];

@NgModule({
  declarations: [ListPoliciesComponent, UpsertPolicyComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(adminKnowledgeBaseRoutes),
    LayoutModule,
    FormlyTaigaUiModule,
    ReactiveFormsModule,
    TranslocoModule,
    FormlyModule,
    TableModule,
    TuiButtonModule,
    TuiTagModule,
    TuiTablePaginationModule,
    TuiLoaderModule,
    TuiMarkerIconModule,
    InputFilterComponentModule
  ],
  providers: [
    AdminKnowledgeBaseService,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'adminKnowledgeBase',
        loader: inlineLoaderFactory((lang) => import(`../../assets/i18n/${lang}.json`)),
      },
    },
  ],
})
export class AdminKnowledgeBaseModule {}
