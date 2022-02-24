import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { JobLevelsEffects } from '@nexthcm/cdk';
import { BaseFormComponentModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard, NgxPermissionsModule } from 'ngx-permissions';

import { UpsertJobLevelDialogComponent } from './components/upsert-job-level-dialog/upsert-job-level-dialog.component';
import en from './i18n/en.json';
import vi from './i18n/vi.json';
import { JobLevelManagementComponent } from './pages/job-level-management/job-level-management.component';
import { AdminJobLevelsService } from './services/admin-job-levels.service';
import { TRANSLATION_SCOPE } from './translation-scope';

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
    AkitaNgEffectsModule.forFeature([JobLevelsEffects]),
  ],
  providers: [
    AdminJobLevelsService,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: { scope: TRANSLATION_SCOPE, loader: { en: () => Promise.resolve(en), vi: () => Promise.resolve(vi) } },
    },
  ],
})
export class AdminJobLevelsModule {}
