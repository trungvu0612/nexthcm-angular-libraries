import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { GetFilePipeModule } from '@nexthcm/cdk';
import { inlineLoaderFactory } from '@nexthcm/core';
import { LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiEditorSocketModule } from '@taiga-ui/addon-editor';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import {
  TuiButtonModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiScrollbarModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiAvatarModule, TuiInputModule, TuiInputMonthModule, TuiTagModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { UpdatedKnowledgeCategoryComponent } from './components/updated-knowledge-category/updated-knowledge-category.component';
import { KnowledgeBaseArticleComponent } from './pages/knowledge-base-article/knowledge-base-article.component';
import { KnowledgeBaseCategoriesComponent } from './pages/knowledge-base-categories/knowledge-base-categories.component';
import { KnowledgeBaseCategoryComponent } from './pages/knowledge-base-category/knowledge-base-category.component';
import { KnowledgeBaseComponent } from './pages/knowledge-base/knowledge-base.component';
import { KnowledgeComponent } from './pages/knowledge/knowledge.component';
import { UpdatedKnowledgeComponent } from './pages/updated-knowledge/updated-knowledge.component';

export const KNOWLEDGE_BASE_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_KNOWLEDGE_BASE', redirectTo: '/' } },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'categories' },
      { path: 'categories', component: KnowledgeBaseCategoriesComponent },
      { path: 'categories/:categoryId', component: KnowledgeBaseCategoryComponent },
      { path: ':articleId', component: KnowledgeBaseArticleComponent },
    ],
  },
];

@NgModule({
  declarations: [
    KnowledgeBaseComponent,
    KnowledgeComponent,
    UpdatedKnowledgeComponent,
    UpdatedKnowledgeCategoryComponent,
    KnowledgeBaseCategoriesComponent,
    KnowledgeBaseCategoryComponent,
    KnowledgeBaseArticleComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(KNOWLEDGE_BASE_ROUTES),
    FormsModule,
    GetFilePipeModule,
    LayoutModule,
    ReactiveFormsModule,
    TranslocoModule,
    FormlyModule,
    TableModule,
    TuiSvgModule,
    TuiInputMonthModule,
    TuiAvatarModule,
    TuiScrollbarModule,
    TuiButtonModule,
    TuiLinkModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiTagModule,
    TuiTablePaginationModule,
    TuiLoaderModule,
    TuiEditorSocketModule,
  ],
  providers: [
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
