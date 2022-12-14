import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { KnowledgeBaseService } from '@nexthcm/knowledge-base';
import {
  BaseFormComponentModule,
  FormlyStatusToggleComponentModule,
  HEADER_TABS,
  InputFilterComponentModule,
  LayoutComponent,
  LayoutModule,
  MenuItem,
} from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiLinkModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiBreadcrumbsModule, TuiTagModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard, NgxPermissionsModule } from 'ngx-permissions';

import { AdminKnowledgeBaseService } from './admin-knowledge-base.service';
import { UpsertKnowledgeBaseCategoryDialogComponent } from './components/upsert-knowledge-base-category-dialog/upsert-knowledge-base-category-dialog.component';
import en from './i18n/en.json';
import vi from './i18n/vi.json';
import { KnowledgeBaseArticleManagementComponent } from './pages/knowledge-base-article-management/knowledge-base-article-management.component';
import { KnowledgeBaseCategoryManagementComponent } from './pages/knowledge-base-category-management/knowledge-base-category-management.component';
import { UpsertKnowledgeBaseArticleComponent } from './pages/upsert-knowledge-base-article/upsert-knowledge-base-article.component';

export const adminKnowledgeBaseRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_ADMIN_KNOWLEDGE', redirectTo: '/' } },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'articles' },
      {
        path: 'articles',
        children: [
          { path: '', component: KnowledgeBaseArticleManagementComponent },
          { path: ':articleId/edit', component: UpsertKnowledgeBaseArticleComponent },
          { path: 'create', component: UpsertKnowledgeBaseArticleComponent },
        ],
      },
      {
        path: 'categories',
        component: KnowledgeBaseCategoryManagementComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'VIEW_CATEGORY_KNOWLEDGE_BASE', redirectTo: '/' } },
      },
    ],
  },
];

const TABS: MenuItem[] = [
  { title: 'articles', route: '/admin/knowledge-base/articles', permissions: [] },
  { title: 'categories', route: '/admin/knowledge-base/categories', permissions: [] },
];

@NgModule({
  declarations: [
    KnowledgeBaseArticleManagementComponent,
    KnowledgeBaseCategoryManagementComponent,
    UpsertKnowledgeBaseCategoryDialogComponent,
    UpsertKnowledgeBaseArticleComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(adminKnowledgeBaseRoutes),
    LayoutModule,
    ReactiveFormsModule,
    TranslocoModule,
    FormlyModule,
    TableModule,
    TuiButtonModule,
    TuiTagModule,
    TuiTablePaginationModule,
    TuiLoaderModule,
    InputFilterComponentModule,
    NgxPermissionsModule,
    BaseFormComponentModule,
    FormlyStatusToggleComponentModule,
    TuiBreadcrumbsModule,
    TuiLinkModule,
    PushModule,
  ],
  providers: [
    AdminKnowledgeBaseService,
    KnowledgeBaseService,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'adminKnowledgeBase',
        loader: { en: () => Promise.resolve(en), vi: () => Promise.resolve(vi) },
      },
    },
    { provide: HEADER_TABS, useValue: TABS },
  ],
})
export class AdminKnowledgeBaseModule {}
