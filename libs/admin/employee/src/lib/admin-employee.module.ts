import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiButtonModule, TuiLabelModule } from '@taiga-ui/core';
import { TuiTabsModule } from '@taiga-ui/kit';
import { DurationFormComponent } from './components/duration-form/duration-form.component';
import { EducationFormComponent } from './components/education-form/education-form.component';
import { FormlyRepeatSectionComponent } from './components/formly-repeat-section/formly-repeat-section.component';
import { GeneralInformationFormComponent } from './components/general-information-form/general-information-form.component';
import { IndividualFormComponent } from './components/individual-form/individual-form.component';
import { ShuiFormComponent } from './components/shui-form/shui-form.component';
import { UpsertEmployeeComponent } from './pages/upsert-employee/upsert-employee.component';

export const adminEmployeeRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [{ path: ':employeeId/edit', component: UpsertEmployeeComponent }],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminEmployeeRoutes),
    ReactiveFormsModule,
    FormlyModule.forChild({ types: [{ name: 'repeat', component: FormlyRepeatSectionComponent }] }),
    TuiTabsModule,
    TranslocoModule,
    TuiButtonModule,
    TuiLabelModule,
  ],
  declarations: [
    UpsertEmployeeComponent,
    GeneralInformationFormComponent,
    IndividualFormComponent,
    DurationFormComponent,
    EducationFormComponent,
    ShuiFormComponent,
    FormlyRepeatSectionComponent,
  ],
})
export class AdminEmployeeModule {}
