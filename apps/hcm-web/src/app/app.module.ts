import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AuthModule, LoginComponent, LogoutComponent } from '@nexthcm/auth';
import { CoreModule } from '@nexthcm/core';
import { FormlyTaigaUiModule } from '@nexthcm/ui';
import { TuiRootModule } from '@taiga-ui/core';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      [
        { path: '', loadChildren: () => import('@nexthcm/home').then((m) => m.HomeModule) },
        {
          path: 'auth',
          children: [
            { path: 'login', component: LoginComponent },
            { path: 'logout', component: LogoutComponent },
            { path: '', redirectTo: 'login', pathMatch: 'full' },
          ],
        },
        { path: 'my-time', loadChildren: () => import('@nexthcm/my-time').then((m) => m.MyTimeModule) },
        { path: 'calendar', loadChildren: () => import('@nexthcm/calendar').then((m) => m.CalendarModule) },
        { path: 'seat-maps', loadChildren: () => import('@nexthcm/seat-maps').then((m) => m.SeatMapsModule) },
        {
          path: 'human-resource',
          loadChildren: () => import('@nexthcm/human-resource').then((m) => m.HumanResourceModule),
        },
        {
          path: 'knowledge-base',
          loadChildren: () => import('@nexthcm/knowledge-base').then((m) => m.KnowledgeBaseModule),
        },
        {
          path: 'admin',
          children: [
            { path: 'offices', loadChildren: () => import('@nexthcm/admin-offices').then((m) => m.AdminOfficesModule) },
            {
              path: 'permissions',
              loadChildren: () => import('@nexthcm/admin-permissions').then((m) => m.AdminPermissionsModule),
            },
            {
              path: 'seat-maps',
              loadChildren: () => import('@nexthcm/admin-seat-maps').then((m) => m.AdminSeatMapsModule),
            },
            {
              path: 'employees',
              loadChildren: () => import('@nexthcm/admin-employees').then((m) => m.AdminEmployeesModule),
            },
            { path: 'tenants', loadChildren: () => import('@nexthcm/admin-tenants').then((m) => m.AdminTenantsModule) },
            {
              path: 'job-level',
              loadChildren: () => import('@nexthcm/admin-job-level').then((m) => m.AdminJobLevelModule),
            },
            {
              path: 'knowledge-base',
              loadChildren: () => import('@nexthcm/admin-knowledge-base').then((m) => m.AdminKnowledgeBaseModule),
            },
            {
              path: 'entitlements',
              loadChildren: () => import('@nexthcm/admin-entitlement').then((m) => m.AdminEntitlementModule),
            },
            {
              path: 'job-titles',
              loadChildren: () => import('@nexthcm/admin-job-titles').then((m) => m.AdminJobTitlesModule),
            },
            {
              path: 'leave-configs',
              loadChildren: () => import('@nexthcm/admin-leave-configs').then((m) => m.AdminLeaveConfigsModule),
            },
            {
              path: 'user-roles',
              loadChildren: () => import('@nexthcm/admin-user-roles').then((m) => m.AdminUserRolesModule),
            },
            {
              path: 'working-times',
              loadChildren: () => import('@nexthcm/admin-working-times').then((m) => m.AdminWorkingTimesModule),
            },
            {
              path: 'requests-config',
              loadChildren: () =>
                import('@nexthcm/admin-requests-configuration').then((m) => m.AdminRequestsConfigurationModule),
            },
          ],
        },
      ],
      {
        paramsInheritanceStrategy: 'always', // get the lazy modules routing params
      }
    ),
    BrowserAnimationsModule,
    TuiRootModule,
    FormlyTaigaUiModule,
    CoreModule.forRoot(environment),
    AuthModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
