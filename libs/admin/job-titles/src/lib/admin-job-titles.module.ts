import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { LayoutComponent } from '@nexthcm/ui';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiTagModule } from '@taiga-ui/kit';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { JobTitlesComponent } from './job-titles.component';
import { ListJobTitleComponent } from './pages/list-job-title/list-job-title.component';
import { UpsertJobTitleComponent } from './pages/upsert-job-title/upsert-job-title.component';
import { TableModule } from 'ngx-easy-table';
import { TranslocoModule } from '@ngneat/transloco';

export const adminJobTitlesRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_JOB_LEVEL', redirectTo: '/' } },
    children: [
      { path: '', component: ListJobTitleComponent },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminJobTitlesRoutes),
    FormlyModule,
    ReactiveFormsModule,
    TuiSvgModule,
    TuiTagModule,
    TuiButtonModule,
    TuiLetModule,
    TuiLoaderModule,
    TableModule,
    TuiTablePaginationModule,
    TranslocoModule,
  ],
  declarations: [JobTitlesComponent, ListJobTitleComponent, UpsertJobTitleComponent],
})
export class AdminJobTitlesModule {}
