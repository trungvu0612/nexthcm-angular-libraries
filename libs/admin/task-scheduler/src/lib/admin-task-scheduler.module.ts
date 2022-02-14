import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import {
  CRON_LOCALIZATION,
  CronBuilderModule,
  CronLocalization,
  EN_LOCALIZATION,
  VI_LOCALIZATION,
} from '@nexthcm/cron-builder';
import { BaseFormComponentModule, FormlyStatusToggleComponentModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule, TranslocoService } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLabelModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiTagModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard, NgxPermissionsModule } from 'ngx-permissions';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EditScheduledTaskDialogComponent } from './components/edit-scheduled-task-dialog/edit-scheduled-task-dialog.component';
import { FormlyQuartzCronComponent } from './components/formly-quartz-cron/formly-quartz-cron.component';
import en from './i18n/en.json';
import vi from './i18n/vi.json';
import { TaskSchedulerComponent } from './pages/task-scheduler/task-scheduler.component';
import { TaskSchedulerService } from './services/task-scheduler.service';
import { TRANSLATION_SCOPE } from './translation-scope';

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
    CronBuilderModule,
    ReactiveFormsModule,
    FormlyModule.forChild({ types: [{ name: 'quartz-cron', component: FormlyQuartzCronComponent }] }),
    BaseFormComponentModule,
    TuiLabelModule,
  ],
  declarations: [EditScheduledTaskDialogComponent, TaskSchedulerComponent, FormlyQuartzCronComponent],
  providers: [
    TaskSchedulerService,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: TRANSLATION_SCOPE,
        alias: TRANSLATION_SCOPE,
        loader: { en: () => Promise.resolve(en), vi: () => Promise.resolve(vi) },
      },
    },
    {
      provide: CRON_LOCALIZATION,
      useFactory(translate: TranslocoService): Observable<CronLocalization> {
        return translate.langChanges$.pipe(map((lang) => (lang === 'vi' ? VI_LOCALIZATION : EN_LOCALIZATION)));
      },
      deps: [TranslocoService],
    },
  ],
})
export class AdminTaskSchedulerModule {}
