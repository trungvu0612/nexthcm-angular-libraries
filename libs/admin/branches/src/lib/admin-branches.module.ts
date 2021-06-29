import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { AdminBranchesComponent } from './admin-branches.component';
import { LayoutComponent } from '@nexthcm/ui';
import { AuthGuard } from '@nexthcm/auth';
import { BranchListComponent } from './pages/branch-list/branch-list.component';
import { UpsertBranchComponent } from './pages/upsert-branch/upsert-branch.component';
import { RepeatSectionComponent } from './components/repeat-section/repeat-section.component';
import { FormlyModule } from '@ngx-formly/core';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { ReactiveFormsModule } from '@angular/forms';

export const adminBranchRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: BranchListComponent },
      { path: 'add', component: UpsertBranchComponent },
      { path: ':id/edit', component: UpsertBranchComponent },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(adminBranchRoutes),
    FormlyModule.forChild({
      types: [{ name: 'repeat', component: RepeatSectionComponent }],
    }),
    TuiButtonModule,
    TuiLetModule,
    TuiTableModule,
    TuiTablePaginationModule,
    ReactiveFormsModule,
    TuiSvgModule,
  ],
  declarations: [AdminBranchesComponent, BranchListComponent, UpsertBranchComponent, RepeatSectionComponent],
})
export class AdminBranchesModule {}
