import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BaseFormComponentModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { LetModule } from '@rx-angular/template';
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
import { TuiDataListWrapperModule, TuiSelectModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard } from 'ngx-permissions';

import { HolidayListComponent } from './components/holiday-list/holiday-list.component';
import { OvertimeWorkingComponent } from './components/overtime-working/overtime-working.component';
import { RepeatSectionComponent } from './components/repeat-section/repeat-section.component';
import { UpsertHolidayDialogComponent } from './components/upsert-holiday-dialog/upsert-holiday-dialog.component';
import en from './i18n/en.json';
import vi from './i18n/vi.json';
import { WorkingTimeSettingsComponent } from './pages/working-time-settings/working-time-settings.component';
import { TRANSLATION_SCOPE } from './translation-scope';

export const adminWorkingTimesRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_ADMIN_CONFIG_TIME', redirectTo: '/' } },
    children: [{ path: '', component: WorkingTimeSettingsComponent }],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminWorkingTimesRoutes),
    FormlyModule.forChild({
      types: [{ name: 'repeat', component: RepeatSectionComponent }],
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
  ],
  declarations: [
    WorkingTimeSettingsComponent,
    RepeatSectionComponent,
    OvertimeWorkingComponent,
    HolidayListComponent,
    UpsertHolidayDialogComponent,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: { scope: TRANSLATION_SCOPE, loader: { en: () => Promise.resolve(en), vi: () => Promise.resolve(vi) } },
    },
  ],
})
export class AdminWorkingTimesModule {}
