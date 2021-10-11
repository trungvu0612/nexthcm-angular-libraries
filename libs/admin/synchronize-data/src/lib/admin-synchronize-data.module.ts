import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { inlineLoaderFactory } from '@nexthcm/core';
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
import { EditSynchronizationSettingDialogComponent } from './components/edit-synchronization-setting-dialog/edit-synchronization-setting-dialog.component';
import { FormlyQuartzCronComponent } from './components/formly-quartz-cron/formly-quartz-cron.component';
import { SynchronizationSettingsComponent } from './pages/synchronization-settings/synchronization-settings.component';
import { SynchronizeDataService } from './services/synchronize-data.service';

export const adminSynchronizeDataRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_SYNC_DATA_MANAGEMENT', redirectTo: '/' } },
    children: [{ path: '', component: SynchronizationSettingsComponent }],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminSynchronizeDataRoutes),
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
  declarations: [
    EditSynchronizationSettingDialogComponent,
    SynchronizationSettingsComponent,
    FormlyQuartzCronComponent,
  ],
  providers: [
    SynchronizeDataService,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'scheduler',
        alias: 'SCHEDULER',
        loader: inlineLoaderFactory((lang) => import(`../../assets/i18n/${lang}.json`)),
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
export class AdminSynchronizeDataModule {}
