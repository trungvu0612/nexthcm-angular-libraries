import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { inlineLoaderFactory } from '@nexthcm/core';
import { AvatarComponentModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { TuiEditorSocketModule } from '@taiga-ui/addon-editor';
import { TuiLinkModule, TuiLoaderModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiBreadcrumbsModule, TuiPaginationModule } from '@taiga-ui/kit';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { KnowledgeBaseArticleComponent } from './pages/knowledge-base-article/knowledge-base-article.component';
import { KnowledgeBaseArticlesComponent } from './pages/knowledge-base-articles/knowledge-base-articles.component';
import { KnowledgeBaseCategoriesComponent } from './pages/knowledge-base-categories/knowledge-base-categories.component';
import { KnowledgeBaseCategoryComponent } from './pages/knowledge-base-category/knowledge-base-category.component';
import { KnowledgeBaseService } from './services';

export const KNOWLEDGE_BASE_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_KNOWLEDGE_BASE', redirectTo: '/' } },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'articles' },
      { path: 'articles', component: KnowledgeBaseArticlesComponent },
      { path: 'articles/:articleId', component: KnowledgeBaseArticleComponent },
      { path: 'categories', component: KnowledgeBaseCategoriesComponent },
      { path: 'categories/:categoryId', component: KnowledgeBaseCategoryComponent },
    ],
  },
];

@NgModule({
  declarations: [
    KnowledgeBaseArticlesComponent,
    KnowledgeBaseCategoriesComponent,
    KnowledgeBaseCategoryComponent,
    KnowledgeBaseArticleComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(KNOWLEDGE_BASE_ROUTES),
    LayoutModule,
    TuiLoaderModule,
    TuiEditorSocketModule,
    TuiPaginationModule,
    AvatarComponentModule,
    TranslocoModule,
    TuiBreadcrumbsModule,
    TuiLinkModule,
    TuiSvgModule,
  ],
  providers: [
    KnowledgeBaseService,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'knowledgeBase',
        alias: 'KNOWLEDGE_BASE',
        loader: inlineLoaderFactory((lang) => import(`../../assets/i18n/${lang}.json`)),
      },
    },
  ],
})
export class KnowledgeBaseModule {}
