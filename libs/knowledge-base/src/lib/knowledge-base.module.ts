import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { GetFilePipeModule } from '@nexthcm/cdk';
import { inlineLoaderFactory } from '@nexthcm/core';
import { HEADER_TABS, LayoutComponent, LayoutModule, MenuItem } from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
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
import { UpdatedKnowledgeComponent } from './components/updated-knowledge/updated-knowledge.component';
import { CategoryComponent } from './pages/category/category.component';
import { KnowledgeBaseComponent } from './pages/knowledge-base/knowledge-base.component';
import { KnowledgeComponent } from './pages/knowledge/knowledge.component';
import { UpdatedComponent } from './pages/updated/updated.component';

export const KNOWLEDGE_BASE_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_KNOWLEDGE_BASE', redirectTo: '/' } },
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'summary' },
      { path: 'summary', component: KnowledgeBaseComponent },
      { path: 'updated', component: UpdatedComponent },
      { path: ':id', component: KnowledgeComponent },
    ],
  },
];
const TABS: MenuItem[] = [
  { label: 'knowledgeBase', link: '/knowledge-base/summary', permissions: [] },
  { label: 'updated', link: '/knowledge-base/updated', permissions: [] },
];

@NgModule({
  declarations: [
    KnowledgeBaseComponent,
    KnowledgeComponent,
    UpdatedComponent,
    UpdatedKnowledgeComponent,
    CategoryComponent,
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
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'knowledge-base',
        loader: inlineLoaderFactory((lang) => import(`../../assets/i18n/${lang}.json`)),
      },
    },
    { provide: HEADER_TABS, useValue: TABS }
  ],
})
export class KnowledgeBaseModule {}
