import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { inlineLoaderFactory } from '@nexthcm/core';
import { LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard, NgxPermissionsModule } from 'ngx-permissions';
import { ListJobTitleComponent } from './pages/list-job-title/list-job-title.component';
import { UpsertJobTitleComponent } from './pages/upsert-job-title/upsert-job-title.component';
import { AdminJobTitlesService } from './services/admin-job-titles.service';

export const adminJobTitlesRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_JOB_TITLE', redirectTo: '/' } },
    children: [{ path: '', component: ListJobTitleComponent }],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminJobTitlesRoutes),
    FormlyModule,
    ReactiveFormsModule,
    TuiButtonModule,
    TuiLetModule,
    TuiLoaderModule,
    TableModule,
    TuiTablePaginationModule,
    TranslocoModule,
    LayoutModule,
    NgxPermissionsModule,
  ],
  declarations: [ListJobTitleComponent, UpsertJobTitleComponent],
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
