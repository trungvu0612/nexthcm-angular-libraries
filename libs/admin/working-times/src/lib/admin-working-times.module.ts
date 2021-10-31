import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { FormlyTaigaUiModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { LetModule } from '@rx-angular/template';
import { TuiLetModule, TuiMapperPipeModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiExpandModule,
  TuiLabelModule,
  TuiLoaderModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiCheckboxLabeledModule,
  TuiDataListWrapperModule,
  TuiInputCountModule,
  TuiInputDateModule,
  TuiInputModule,
  TuiInputTimeModule,
  TuiSelectModule,
  TuiTabsModule,
  TuiToggleModule,
} from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { OvertimeWorkingComponent } from './components/overtime-working/overtime-working.component';
import { RepeatSectionComponent } from './components/repeat-section/repeat-section.component';
import { WorkingTimeSettingsComponent } from './pages/working-time-settings/working-time-settings.component';

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
    TuiInputCountModule,
    TuiTextfieldControllerModule,
    TuiInputModule,
    TuiToggleModule,
    TuiCheckboxLabeledModule,
    TuiInputDateModule,
    TableModule,
    FormlyTaigaUiModule,
    TuiTabsModule,
    TranslocoModule,
    TuiButtonModule,
    TuiInputTimeModule,
    TuiDataListModule,
    TuiDataListWrapperModule,
    TuiSvgModule,
    TuiButtonModule,
    TuiLoaderModule,
    TuiSelectModule,
    TuiLetModule,
    FormsModule,
    TuiMapperPipeModule,
    TuiExpandModule,
    LetModule,
    LayoutModule,
  ],
  declarations: [WorkingTimeSettingsComponent, RepeatSectionComponent, OvertimeWorkingComponent],
})
export class AdminWorkingTimesModule {}
