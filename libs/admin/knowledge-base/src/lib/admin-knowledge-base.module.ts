import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { inlineLoaderFactory } from '@nexthcm/core';
import {
  FormlyTaigaUiModule,
  InputFilterComponentModule,
  LayoutComponent,
  LayoutModule,
  HEADER_TABS,
  MenuItem
} from '@nexthcm/ui';
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
import { ListCategoryComponent } from './pages/list-category/list-category.component';

export const adminKnowledgeBaseRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_ADMIN_KNOWLEDGE', redirectTo: '/' } },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'knowledge' },
      { path: 'knowledge', component: ListPoliciesComponent },
      {
        path: 'category',
        component: ListCategoryComponent,
        canActivate: [NgxPermissionsGuard]
      },
      {
        path: 'knowledge/add',
        component: UpsertPolicyComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'CREATE_ADMIN_KNOWLEDGE', redirectTo: '/' } }
      },
      {
        path: 'knowledge/:id/edit',
        component: UpsertPolicyComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'UPDATE_ADMIN_KNOWLEDGE', redirectTo: '/' } }
      }
    ]
  }
];

const TABS: MenuItem[] = [
  { label: 'knowledgeBase', link: '/admin/knowledge-base/knowledge', permissions: [] },
  { label: 'category', link: '/admin/knowledge-base/category', permissions: [] }
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
        loader: inlineLoaderFactory((lang) => import(`../../assets/i18n/${lang}.json`))
      }
    },
    { provide: HEADER_TABS, useValue: TABS }
  ]
})
export class AdminKnowledgeBaseModule {
}
