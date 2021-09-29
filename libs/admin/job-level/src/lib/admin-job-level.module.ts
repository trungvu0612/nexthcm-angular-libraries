import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { inlineLoaderFactory } from '@nexthcm/core';
import { BaseFormComponentModule, FormlyTaigaUiModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiMarkerIconModule, TuiTagModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { JobLevelComponent } from './job-level.component';
import { JobLevelService } from './job-level.service';
import { ListJobLevelComponent } from './list-job-level/list-job-level.component';
import { UpsertJobLevelComponent } from './upsert-job-level/upsert-job-level.component';

export const adminJobLevelRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_JOB_LEVEL', redirectTo: '/' } },
    children: [{ path: '', component: ListJobLevelComponent }],
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
    TuiLetModule,
    FormlyTaigaUiModule,
    TuiMarkerIconModule,
    ReactiveFormsModule,
    RouterModule.forChild(adminJobLevelRoutes),
    TranslocoModule,
    LayoutModule,
    BaseFormComponentModule,
    TuiLoaderModule,
    TableModule,
  ],
  providers: [
    JobLevelService,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'jobLevel',
        loader: inlineLoaderFactory((lang) => import(`../../assets/i18n/${lang}.json`)),
      },
    },
  ],
})
export class AdminJobLevelModule {}
