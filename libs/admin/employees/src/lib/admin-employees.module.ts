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
import { inlineLoaderFactory } from '@nexthcm/core';
import {
  BaseFormComponentModule,
  FormlySelectOrgTreeComponentModule,
  FormlyStatusToggleComponentModule,
  FormlyUserComboBoxComponentModule,
  InputFilterComponentModule,
  LayoutComponent,
  LayoutModule,
  SelectFilterComponentModule,
} from '@nexthcm/ui';
import { NgStackFormsModule } from '@ng-stack/forms';
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
import { EmployeeManagementComponent } from './pages/employee-management/employee-management.component';
import { AdminEmployeesService } from './services/admin-employees.service';

export const ADMIN_EMPLOYEE_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_EMPLOYEE', redirectTo: '/' } },
    children: [
      { path: '', component: EmployeeManagementComponent },
      {
        path: ':employeeId',
        component: EditEmployeeDialogComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'UPDATE_EMPLOYEE', redirectTo: '/' } },
        children: [
          { path: '', redirectTo: 'general', pathMatch: 'full' },
          { path: 'general', component: GeneralInformationComponent },
          { path: 'individual', component: IndividualFormComponent },
          { path: 'duration', component: DurationFormComponent },
          { path: 'education', component: EducationFormComponent },
          { path: 'shui', component: ShuiFormComponent },
          { path: 'attachments', component: AttachmentFormComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ADMIN_EMPLOYEE_ROUTES),
    NgStackFormsModule,
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
      useValue: {
        scope: 'employees',
        loader: inlineLoaderFactory((lang) => import(`../../assets/i18n/${lang}.json`)),
      },
    },
  ],
})
export class AdminEmployeesModule {}
