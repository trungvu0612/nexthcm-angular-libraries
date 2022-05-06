import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { FormlyQuartzCronComponentModule } from '@nexthcm/crontab/formly';
import { BaseFormComponentModule, FormlyStatusToggleComponentModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { PushModule } from '@rx-angular/template';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLabelModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiTagModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard, NgxPermissionsModule } from 'ngx-permissions';

import { EditScheduledTaskDialogComponent } from './components/edit-scheduled-task-dialog/edit-scheduled-task-dialog.component';
import en from './i18n/en.json';
import vi from './i18n/vi.json';
import { TaskSchedulerComponent } from './pages/task-scheduler/task-scheduler.component';
import { TaskSchedulerService } from './services/task-scheduler.service';

export const adminTaskSchedulerRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_SYNC_DATA_MANAGEMENT', redirectTo: '/' } },
    children: [{ path: '', component: TaskSchedulerComponent }],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminTaskSchedulerRoutes),
    TableModule,
    LayoutModule,
    TranslocoModule,
    TuiLoaderModule,
    TuiLetModule,
    TuiTagModule,
    NgxPermissionsModule,
    TuiButtonModule,
    FormlyStatusToggleComponentModule,
    BaseFormComponentModule,
    TuiLabelModule,
    FormlyQuartzCronComponentModule,
    PushModule,
  ],
  declarations: [EditScheduledTaskDialogComponent, TaskSchedulerComponent],
  providers: [
    TaskSchedulerService,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'taskScheduler',
        loader: { en: () => Promise.resolve(en), vi: () => Promise.resolve(vi) },
      },
    },
  ],
})
export class AdminTaskSchedulerModule {}
