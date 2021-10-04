import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { inlineLoaderFactory } from '@nexthcm/core';
import { BaseFormComponentModule, FormlyStatusToggleComponentModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiTagModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard, NgxPermissionsModule } from 'ngx-permissions';
import { UpsertJobTitleDialogComponent } from './components/upsert-job-title-dialog/upsert-job-title-dialog.component';
import { JobTitleManagementComponent } from './pages/job-title-management/job-title-management.component';
import { AdminJobTitlesService } from './services/admin-job-titles.service';

export const adminJobTitlesRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_JOB_TITLE', redirectTo: '/' } },
    children: [{ path: '', component: JobTitleManagementComponent }],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminJobTitlesRoutes),
    TuiButtonModule,
    TuiLetModule,
    TuiLoaderModule,
    TableModule,
    TuiTablePaginationModule,
    TranslocoModule,
    LayoutModule,
    NgxPermissionsModule,
    BaseFormComponentModule,
    TuiTagModule,
    FormlyStatusToggleComponentModule,
  ],
  declarations: [JobTitleManagementComponent, UpsertJobTitleDialogComponent],
  providers: [
    AdminJobTitlesService,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'jobTitles',
        loader: inlineLoaderFactory((lang) => import(`../../assets/i18n/${lang}.json`)),
      },
    },
  ],
})
export class AdminJobTitlesModule {}
