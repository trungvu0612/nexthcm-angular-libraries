import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { GetFileModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import {
  TuiButtonModule,
  TuiLinkModule,
  TuiScrollbarModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiAvatarModule, TuiInputModule, TuiInputMonthModule, TuiTagModule } from '@taiga-ui/kit';
import { UpdatedKnowledgeComponent } from './components/updated-knowledge/updated-knowledge.component';
import { KnowledgeBaseComponent } from './pages/knowledge-base/knowledge-base.component';
import { KnowledgeComponent } from './pages/knowledge/knowledge.component';
import { UpdatedComponent } from './pages/updated/updated.component';
import { TranslocoModule } from '@ngneat/transloco';
import { CategoryComponent } from './pages/category/category.component';
import { TableModule } from 'ngx-easy-table';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { NgxPermissionsGuard } from 'ngx-permissions';

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
      { path: 'category', component: CategoryComponent },
      { path: ':id', component: KnowledgeComponent },
    ],
  },
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
    ReactiveFormsModule,
    TranslocoModule,
    LayoutModule,
    GetFileModule,
    TuiSvgModule,
    TuiInputMonthModule,
    TuiAvatarModule,
    TuiScrollbarModule,
    TuiButtonModule,
    TuiLinkModule,
    TuiInputModule,
    TableModule,
    FormlyModule,
    TuiTextfieldControllerModule,
    TuiTagModule,
    TuiTablePaginationModule,
    TuiLetModule,
  ],
})
export class KnowledgeBaseModule {}
