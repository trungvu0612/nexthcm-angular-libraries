import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { PromptComponentModule } from '@nexthcm/cdk';
import { LayoutComponent } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiLabelModule, TuiLoaderModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiCheckboxModule, TuiTabsModule } from '@taiga-ui/kit';
import { academicCap, HeroIconModule, identification, informationCircle } from 'ng-heroicon';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { DurationFormComponent } from './components/duration-form/duration-form.component';
import { EducationFormComponent } from './components/education-form/education-form.component';
import { FormlyRepeatSectionComponent } from './components/formly-repeat-section/formly-repeat-section.component';
import { GeneralInformationFormComponent } from './components/general-information-form/general-information-form.component';
import { IndividualFormComponent } from './components/individual-form/individual-form.component';
import { InitEmployeeDialogComponent } from './components/init-employee-dialog/init-employee-dialog.component';
import { ShuiFormComponent } from './components/shui-form/shui-form.component';
import { EditEmployeeComponent } from './pages/edit-employee/edit-employee.component';
import { EmployeeManagementComponent } from './pages/employee-management/employee-management.component';
import { AdminEmployeeService } from './services/admin-employee.service';

export const ADMIN_EMPLOYEE_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_EMPLOYEE', redirectTo: '/' } },
    children: [
      { path: '', component: EmployeeManagementComponent },
      {
        path: ':employeeId/edit',
        component: EditEmployeeComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'UPDATE_EMPLOYEE', redirectTo: '/' } },
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ADMIN_EMPLOYEE_ROUTES),
    ReactiveFormsModule,
    FormlyModule.forChild({ types: [{ name: 'repeat', component: FormlyRepeatSectionComponent }] }),
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
  ],
  declarations: [
    EditEmployeeComponent,
    GeneralInformationFormComponent,
    IndividualFormComponent,
    DurationFormComponent,
    EducationFormComponent,
    ShuiFormComponent,
    FormlyRepeatSectionComponent,
    EmployeeManagementComponent,
    InitEmployeeDialogComponent,
  ],
  providers: [AdminEmployeeService],
})
export class AdminEmployeeModule {}
