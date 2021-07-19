import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@nexthcm/auth';
import { GetFileModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TuiScrollbarModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiAvatarModule, TuiInputMonthModule } from '@taiga-ui/kit';
import { UpdatedDetailComponent } from './components/updated-detail/updated-detail.component';
import { KnowledgeBaseComponent } from './knowledge-base.component';
import { PoliciesComponent } from './pages/policies/policies.component';
import { PolicyDetailComponent } from './pages/policy-detail/policy-detail.component';
import { UpdatedComponent } from './pages/updated/updated.component';

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
          { path: '', component: PoliciesComponent },
          { path: 'updated', component: UpdatedComponent },
          { path: ':id', component: PolicyDetailComponent },
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [KnowledgeBaseComponent, PoliciesComponent, PolicyDetailComponent, UpdatedComponent, UpdatedDetailComponent],
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
  ],
})
export class KnowledgeBaseModule {}
