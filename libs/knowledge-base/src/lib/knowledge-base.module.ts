import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@nexthcm/auth';
import { GetFileModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TuiButtonModule, TuiLinkModule, TuiScrollbarModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiAvatarModule, TuiInputMonthModule } from '@taiga-ui/kit';
import { UpdatedKnowledgeComponent } from './components/updated-knowledge/updated-knowledge.component';
import { KnowledgeBaseComponent } from './knowledge-base.component';
import { KnowledgeBasePageComponent } from './pages/knowledge-base-page/knowledge-base-page.component';
import { KnowledgeComponent } from './pages/knowledge/knowledge.component';
import { UpdatedComponent } from './pages/updated/updated.component';
import { TranslocoModule } from '@ngneat/transloco';

export const knowledgeBaseRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: KnowledgeBaseComponent,
        children: [
          { path: '', component: KnowledgeBasePageComponent },
          { path: 'updated', component: UpdatedComponent },
          { path: ':id', component: KnowledgeComponent },
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [
    KnowledgeBaseComponent,
    KnowledgeBasePageComponent,
    KnowledgeComponent,
    UpdatedComponent,
    UpdatedKnowledgeComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(knowledgeBaseRoutes),
    LayoutModule,
    GetFileModule,
    TuiSvgModule,
    TuiInputMonthModule,
    ReactiveFormsModule,
    TuiAvatarModule,
    TuiScrollbarModule,
    TuiButtonModule,
    TuiLinkModule,
    TranslocoModule,
  ],
})
export class KnowledgeBaseModule {}
