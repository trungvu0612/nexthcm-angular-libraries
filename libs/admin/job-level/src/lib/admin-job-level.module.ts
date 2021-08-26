import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { FormlyTaigaUiModule, LayoutComponent } from '@nexthcm/ui';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiMarkerIconModule, TuiTagModule } from '@taiga-ui/kit';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { JobLevelComponent } from './job-level.component';
import { ListJobLevelComponent } from './list-job-level/list-job-level.component';
import { UpsertJobLevelComponent } from './upsert-job-level/upsert-job-level.component';
import { TranslocoModule } from '@ngneat/transloco';

export const adminJobLevelRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_JOB_LEVEL', redirectTo: '/' } },
    children: [
      {
        path: '',
        component: JobLevelComponent,
        children: [
          { path: '', component: ListJobLevelComponent },
          {
            path: 'add',
            component: UpsertJobLevelComponent,
            canActivate: [NgxPermissionsGuard],
            data: { permissions: { only: 'CREATE_JOB_LEVEL', redirectTo: '/' } },
          },
          {
            path: 'edit/:id',
            component: UpsertJobLevelComponent,
            canActivate: [NgxPermissionsGuard],
            data: { permissions: { only: 'UPDATE_JOB_LEVEL', redirectTo: '/' } },
          },
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [JobLevelComponent, ListJobLevelComponent, UpsertJobLevelComponent],
  imports: [
    CommonModule,
    TuiTableModule,
    TuiTablePaginationModule,
    TuiButtonModule,
    TuiTagModule,
    FormlyModule,
    FormlyTaigaUiModule,
    TuiMarkerIconModule,
    ReactiveFormsModule,
    RouterModule.forChild(adminJobLevelRoutes),
    RouterModule,
    TranslocoModule
  ],
})
export class AdminJobLevelModule {}
