import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { AuthGuard } from '@nexthcm/auth';
import { LayoutComponent } from '@nexthcm/ui';
import { FormlyModule } from '@ngx-formly/core';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiTagModule } from '@taiga-ui/kit';
import { JobTitlesComponent } from './job-titles.component';
import { ListJobTitleComponent } from './pages/list-job-title/list-job-title.component';
import { UpsertJobTitleComponent } from './pages/upsert-job-title/upsert-job-title.component';
import { TuiLetModule } from '@taiga-ui/cdk';

export const adminJobTitlesRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ListJobTitleComponent },
      // { path: 'add', component: UpsertJobTitleComponent },
      // { path: ':id/edit', component: UpsertJobTitleComponent },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(adminJobTitlesRoutes),
    FormlyModule,
    RxReactiveFormsModule,
    TuiTablePaginationModule,
    TuiTableModule,
    TuiSvgModule,
    TuiTagModule,
    TuiButtonModule,
    TuiLetModule,
  ],
  declarations: [JobTitlesComponent, ListJobTitleComponent, UpsertJobTitleComponent],
})
export class AdminJobTitlesModule {}
