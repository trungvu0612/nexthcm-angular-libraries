import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { inlineLoaderFactory } from '@nexthcm/core';
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
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiLinkModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiBreadcrumbsModule, TuiTagModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard, NgxPermissionsModule } from 'ngx-permissions';
import { AdminKnowledgeBaseService } from './admin-knowledge-base.service';
import { UpsertKnowledgeBaseCategoryDialogComponent } from './components/upsert-knowledge-base-category-dialog/upsert-knowledge-base-category-dialog.component';
import { KnowledgeBaseArticleManagementComponent } from './pages/knowledge-base-article-management/knowledge-base-article-management.component';
import { KnowledgeBaseCategoryManagementComponent } from './pages/knowledge-base-category-management/knowledge-base-category-management.component';
import { UpsertKnowledgeBaseArticleComponent } from './pages/upsert-knowledge-base-article/upsert-knowledge-base-article.component';
import {
  KnowledgeBaseCategoriesEffects,
  KnowledgeBaseCategoriesQuery,
  KnowledgeBaseCategoriesStores,
} from './state/knowledge-base-categories';

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
  { label: 'articles', link: '/admin/knowledge-base/articles', permissions: [] },
  { label: 'categories', link: '/admin/knowledge-base/categories', permissions: [] },
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
    AkitaNgEffectsModule.forFeature([KnowledgeBaseCategoriesEffects]),
  ],
  providers: [
    AdminKnowledgeBaseService,
    KnowledgeBaseService,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'adminKnowledgeBase',
        loader: inlineLoaderFactory((lang) => import(`../../assets/i18n/${lang}.json`)),
      },
    },
    { provide: HEADER_TABS, useValue: TABS },
    KnowledgeBaseCategoriesStores,
    KnowledgeBaseCategoriesQuery,
  ],
})
export class AdminKnowledgeBaseModule {}
