import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import {
  AddressService,
  JobLevelsEffects,
  JobTitlesEffects,
  JoinByKeyPipeModule,
  OfficesEffects,
  OrganizationsEffects,
  PromptComponentModule,
  RolesEffects,
} from '@nexthcm/cdk';
import {
  BaseFormComponentModule,
  FormlySelectOrgTreeComponentModule,
  FormlyStatusToggleComponentModule,
  FormlyUserComboBoxComponentModule,
  InputDateRangeFilterComponentModule,
  InputFilterComponentModule,
  LayoutComponent,
  LayoutModule,
  SelectFilterComponentModule,
  SelectMonthFilterComponentModule,
} from '@nexthcm/ui';
import { NgsFormsModule } from '@ng-stack/forms';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiDataListModule, TuiLabelModule, TuiLoaderModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiCheckboxModule, TuiTabsModule, TuiToggleModule } from '@taiga-ui/kit';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';
import { academicCap, HeroIconModule, identification, informationCircle } from 'ng-heroicon';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard, NgxPermissionsModule } from 'ngx-permissions';
import { AttachmentFormComponent } from './components/attachment-form/attachment-form.component';
import { DurationFormComponent } from './components/duration-form/duration-form.component';
import { EditEmployeeDialogComponent } from './components/edit-employee-dialog/edit-employee-dialog.component';
import { EducationFormComponent } from './components/education-form/education-form.component';
import { FormlyDownloadButtonComponent } from './components/formly-download-button/formly-download-button.component';
import { FormlyRepeatSectionComponent } from './components/formly-repeat-section/formly-repeat-section.component';
import { GeneralInformationFormComponent } from './components/general-information-form/general-information-form.component';
import { GeneralInformationComponent } from './components/general-information/general-information.component';
import { IndividualFormComponent } from './components/individual-form/individual-form.component';
import { InitEmployeeDialogComponent } from './components/init-employee-dialog/init-employee-dialog.component';
import { ShuiFormComponent } from './components/shui-form/shui-form.component';
import en from './i18n/en.json';
import vi from './i18n/vi.json';
import { EmployeeManagementComponent } from './pages/employee-management/employee-management.component';
import { AdminEmployeesService } from './services/admin-employees.service';
import { TRANSLATION_SCOPE } from './translation-scope';

export const ADMIN_EMPLOYEE_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_EMPLOYEE', redirectTo: '/' } },
    children: [{ path: '', component: EmployeeManagementComponent }],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ADMIN_EMPLOYEE_ROUTES),
    NgsFormsModule,
    FormlyModule.forChild({
      types: [
        { name: 'repeat', component: FormlyRepeatSectionComponent },
        { name: 'download-button', component: FormlyDownloadButtonComponent },
      ],
    }),
    TuiTabsModule,
    TranslocoModule,
    TuiButtonModule,
    TuiLabelModule,
    TuiSvgModule,
    TuiLoaderModule,
    TableModule,
    TuiCheckboxModule,
    PromptComponentModule,
    FormsModule,
    TuiTablePaginationModule,
    HeroIconModule.withIcons({ academicCap, informationCircle, identification }),
    LayoutModule,
    TuiLetModule,
    InputFilterComponentModule,
    PolymorpheusModule,
    TuiToggleModule,
    FormlyUserComboBoxComponentModule,
    BaseFormComponentModule,
    FormlySelectOrgTreeComponentModule,
    FormlyStatusToggleComponentModule,
    AkitaNgEffectsModule.forFeature([
      JobLevelsEffects,
      JobTitlesEffects,
      RolesEffects,
      OfficesEffects,
      OrganizationsEffects,
    ]),
    NgxPermissionsModule,
    JoinByKeyPipeModule,
    SelectFilterComponentModule,
    TuiDataListModule,
    PushModule,
    SelectMonthFilterComponentModule,
    InputDateRangeFilterComponentModule,
  ],
  declarations: [
    EditEmployeeDialogComponent,
    GeneralInformationFormComponent,
    IndividualFormComponent,
    DurationFormComponent,
    EducationFormComponent,
    ShuiFormComponent,
    FormlyRepeatSectionComponent,
    EmployeeManagementComponent,
    InitEmployeeDialogComponent,
    GeneralInformationComponent,
    AttachmentFormComponent,
    FormlyDownloadButtonComponent,
  ],
  providers: [
    AdminEmployeesService,
    AddressService,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: { scope: TRANSLATION_SCOPE, loader: { en: () => Promise.resolve(en), vi: () => Promise.resolve(vi) } },
    },
  ],
})
export class AdminEmployeesModule {}
