import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { inlineLoaderFactory } from '@nexthcm/core';
import { BaseFormComponentModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard, NgxPermissionsModule } from 'ngx-permissions';
import { UpsertJobLevelDialogComponent } from './components/upsert-job-level-dialog/upsert-job-level-dialog.component';
import { JobLevelManagementComponent } from './pages/job-level-management/job-level-management.component';
import { AdminJobLevelsService } from './services/admin-job-levels.service';

export const adminJobLevelsRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_JOB_LEVEL', redirectTo: '/' } },
    children: [{ path: '', component: JobLevelManagementComponent }],
  },
];

@NgModule({
  declarations: [JobLevelManagementComponent, UpsertJobLevelDialogComponent],
  imports: [
    CommonModule,
    TuiTablePaginationModule,
    TuiButtonModule,
    TuiLetModule,
    RouterModule.forChild(adminJobLevelsRoutes),
    TranslocoModule,
    LayoutModule,
    BaseFormComponentModule,
    TuiLoaderModule,
    TableModule,
    NgxPermissionsModule,
  ],
  providers: [
    AdminJobLevelsService,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'jobLevels',
        loader: inlineLoaderFactory((lang) => import(`../../assets/i18n/${lang}.json`)),
      },
    },
  ],
})
export class AdminJobLevelsModule {}
