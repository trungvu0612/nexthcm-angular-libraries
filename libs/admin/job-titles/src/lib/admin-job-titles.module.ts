import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  BaseFormComponentModule,
  FormlyStatusToggleComponentModule,
  InputFilterComponentModule,
  LayoutComponent,
  LayoutModule,
} from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@rx-angular/template';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiTagModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard, NgxPermissionsModule } from 'ngx-permissions';

import { UpsertJobTitleDialogComponent } from './components/upsert-job-title-dialog/upsert-job-title-dialog.component';
import en from './i18n/en.json';
import vi from './i18n/vi.json';
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
    InputFilterComponentModule,
    PushModule,
  ],
  declarations: [JobTitleManagementComponent, UpsertJobTitleDialogComponent],
  providers: [
    AdminJobTitlesService,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: { scope: 'jobTitles', loader: { en: () => Promise.resolve(en), vi: () => Promise.resolve(vi) } },
    },
  ],
})
export class AdminJobTitlesModule {}
