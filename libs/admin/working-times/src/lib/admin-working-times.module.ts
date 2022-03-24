import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import {
  BaseFormComponentModule,
  HEADER_TABS,
  InputFilterComponentModule,
  LayoutComponent,
  LayoutModule,
  MenuItem,
} from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { LetModule, PushModule } from '@rx-angular/template';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiLabelModule,
  TuiLoaderModule,
  TuiPrimitiveCheckboxModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiCheckboxModule,
  TuiDataListWrapperModule,
  TuiSelectModule,
  TuiTabsModule,
  TuiTagModule,
} from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard } from 'ngx-permissions';

import { FormlyDailyHourConfigComponent } from './components/formly-daily-hour-config/formly-daily-hour-config.component';
import { HolidayListComponent } from './components/holiday-list/holiday-list.component';
import { RepeatSectionComponent } from './components/repeat-section/repeat-section.component';
import { UpsertHolidayDialogComponent } from './components/upsert-holiday-dialog/upsert-holiday-dialog.component';
import en from './i18n/en.json';
import vi from './i18n/vi.json';
import { CheckinCheckoutExceptionComponent } from './pages/checkin-checkout-exception/checkin-checkout-exception.component';
import { EmployeesCICOExceptionComponent } from './pages/employees-cico-exception/employees-cico-exception.component';
import { JobTitlesCICOExceptionComponent } from './pages/job-titles-cico-exception/job-titles-cico-exception.component';
import { OfficesCICOExceptionComponent } from './pages/offices-cico-exception/offices-cico-exception.component';
import { WorkingTimeConfigurationComponent } from './pages/working-time-configuration/working-time-configuration.component';
import { WorkingTimesService } from './services/working-times.service';

export const adminWorkingTimesRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_ADMIN_CONFIG_TIME', redirectTo: '/' } },
    children: [
      { path: '', redirectTo: 'configuration', pathMatch: 'full' },
      { path: 'configuration', component: WorkingTimeConfigurationComponent },
      {
        path: 'cico-exception',
        component: CheckinCheckoutExceptionComponent,
        children: [
          { path: '', redirectTo: 'job-titles', pathMatch: 'full' },
          { path: 'job-titles', component: JobTitlesCICOExceptionComponent },
          { path: 'offices', component: OfficesCICOExceptionComponent },
          { path: 'employees', component: EmployeesCICOExceptionComponent },
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [
    WorkingTimeConfigurationComponent,
    RepeatSectionComponent,
    HolidayListComponent,
    UpsertHolidayDialogComponent,
    CheckinCheckoutExceptionComponent,
    JobTitlesCICOExceptionComponent,
    OfficesCICOExceptionComponent,
    EmployeesCICOExceptionComponent,
    FormlyDailyHourConfigComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(adminWorkingTimesRoutes),
    FormlyModule.forChild({
      types: [
        { name: 'repeat', component: RepeatSectionComponent },
        { name: 'daily-hour-config', component: FormlyDailyHourConfigComponent },
      ],
    }),
    ReactiveFormsModule,
    TuiLabelModule,
    TableModule,
    TranslocoModule,
    TuiButtonModule,
    TuiDataListModule,
    TuiDataListWrapperModule,
    TuiSvgModule,
    TuiButtonModule,
    TuiLoaderModule,
    TuiSelectModule,
    TuiLetModule,
    FormsModule,
    LetModule,
    LayoutModule,
    TuiTablePaginationModule,
    TuiPrimitiveCheckboxModule,
    BaseFormComponentModule,
    TuiTextfieldControllerModule,
    TuiTabsModule,
    TuiTagModule,
    TuiCheckboxModule,
    InputFilterComponentModule,
    PushModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'workingTimeConfiguration',
        loader: { en: () => Promise.resolve(en), vi: () => Promise.resolve(vi) },
      },
    },
    {
      provide: HEADER_TABS,
      useValue: [
        { title: 'configuration', route: '/admin/working-times/configuration', permissions: [] },
        {
          title: 'workingTimeConfiguration.cicoException',
          route: '/admin/working-times/cico-exception',
          permissions: [],
        },
      ] as MenuItem[],
    },
    WorkingTimesService,
  ],
})
export class AdminWorkingTimesModule {}
