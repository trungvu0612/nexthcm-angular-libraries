import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { EmojiModule } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { GetFilePipeModule } from '@nexthcm/cdk';
import { LeaveRequestDateRangeComponentModule, MyTimeService } from '@nexthcm/my-time';
import {
  AvatarComponentModule,
  InputFilterComponentModule,
  InputNumberFilterComponentModule,
  LayoutComponent,
  LayoutModule,
  SelectMonthFilterComponentModule,
} from '@nexthcm/ui';
import { POSITION_OPTIONS } from '@ng-web-apis/geolocation';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TranslocoModule } from '@ngneat/transloco';
import { TranslocoLocaleModule } from '@ngneat/transloco-locale';
import { LetModule, PushModule } from '@rx-angular/template';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownControllerModule,
  TuiHintModule,
  TuiHostedDropdownModule,
  TuiLabelModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiModeModule,
  TuiPrimitiveSpinButtonModule,
  TuiScrollbarModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiCheckboxLabeledModule,
  TuiDropdownHoverModule,
  TuiInputCopyModule,
  TuiInputModule,
  TuiInputNumberModule,
  TuiIslandModule,
  TuiMarkerIconModule,
  TuiProgressModule,
  TuiSelectModule,
  TuiTabsModule,
  TuiTagModule,
} from '@taiga-ui/kit';
import { CalendarModule } from 'angular-calendar';
import { NgxPermissionsGuard, NgxPermissionsModule } from 'ngx-permissions';

import { LeaveCalendarDateItemComponent } from './components/leave-calendar-date-item/leave-calendar-date-item.component';
import { ManagerLeaveCalendarComponent } from './components/manager-leave-calendar/manager-leave-calendar.component';
import { PersonalAccessTokenComponent } from './components/personal-access-token/personal-access-token.component';
import { ProfileDurationComponent } from './components/profile-duration/profile-duration.component';
import { ProfileEducationComponent } from './components/profile-education/profile-education.component';
import { ProfileExperienceComponent } from './components/profile-experience/profile-experience.component';
import { ProfileIndividualComponent } from './components/profile-individual/profile-individual.component';
import { ProfileShuiComponent } from './components/profile-shui/profile-shui.component';
import { RequestCalendarComponent } from './components/request-calendar/request-calendar.component';
import { UserWorkingHoursCalendarComponent } from './components/user-working-hours-calendar/user-working-hours-calendar.component';
import { WorkingHoursCalendarItemComponent } from './components/working-hours-calendar-item/working-hours-calendar-item.component';
import { HomeComponent } from './home.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { homeIcons } from './shared/icons/home';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_OVERVIEW', redirectTo: '/login' } },
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      {
        path: 'overview',
        component: HomeComponent,
        children: [
          { path: '', redirectTo: 'me', pathMatch: 'full' },
          { path: 'me', component: UserWorkingHoursCalendarComponent },
          {
            path: 'everyone',
            component: ManagerLeaveCalendarComponent,
            canActivate: [NgxPermissionsGuard],
            data: { permissions: { only: ['VIEW_REQUEST_MANAGEMENT', 'VIEW_SUBORDINATE_REQUEST'], redirectTo: '/' } },
          },
        ],
      },
      {
        path: 'profile',
        component: ProfileComponent,
        children: [
          { path: '', redirectTo: 'individual', pathMatch: 'full' },
          { path: 'individual', component: ProfileIndividualComponent },
          { path: 'duration', component: ProfileDurationComponent },
          { path: 'education', component: ProfileEducationComponent },
          { path: 'experience', component: ProfileExperienceComponent },
          { path: 'shui', component: ProfileShuiComponent },
          { path: 'access-token', component: PersonalAccessTokenComponent },
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    ProfileComponent,
    ProfileIndividualComponent,
    ProfileDurationComponent,
    ProfileEducationComponent,
    ProfileShuiComponent,
    PersonalAccessTokenComponent,
    UserWorkingHoursCalendarComponent,
    ManagerLeaveCalendarComponent,
    RequestCalendarComponent,
    LeaveCalendarDateItemComponent,
    WorkingHoursCalendarItemComponent,
    ProfileExperienceComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(HOME_ROUTES),
    LayoutModule,
    TranslocoLocaleModule,
    TranslocoModule,
    EmojiModule,
    LetModule,
    TuiLoaderModule,
    TuiLinkModule,
    TuiModeModule,
    SvgIconsModule.forChild(homeIcons),
    TuiButtonModule,
    GetFilePipeModule,
    AvatarComponentModule,
    TuiTabsModule,
    TuiSvgModule,
    TuiLetModule,
    TuiIslandModule,
    TuiInputCopyModule,
    TuiTextfieldControllerModule,
    FormsModule,
    TuiLabelModule,
    PushModule,
    TuiTableModule,
    InputNumberFilterComponentModule,
    SelectMonthFilterComponentModule,
    TuiTablePaginationModule,
    TuiScrollbarModule,
    TuiDropdownHoverModule,
    TuiDropdownControllerModule,
    TuiHostedDropdownModule,
    TuiTagModule,
    LeaveRequestDateRangeComponentModule,
    LeaveRequestDateRangeComponentModule,
    LeaveRequestDateRangeComponentModule,
    TuiDataListModule,
    NgxPermissionsModule,
    InputFilterComponentModule,
    CalendarModule,
    TuiPrimitiveSpinButtonModule,
    TuiHintModule,
    ReactiveFormsModule,
    TuiInputNumberModule,
    TuiSelectModule,
    TuiInputModule,
    TuiMarkerIconModule,
    TuiProgressModule,
    TuiCheckboxLabeledModule,
  ],
  providers: [
    MyTimeService,
    {
      provide: POSITION_OPTIONS,
      useValue: { enableHighAccuracy: true, timeout: 3000, maximumAge: 1000 },
    },
  ],
})
export class HomeModule {}
