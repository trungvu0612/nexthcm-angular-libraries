import { registerLocaleData } from '@angular/common';
import localeEn from '@angular/common/locales/en';
import localeVi from '@angular/common/locales/vi';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { AuthModule, LoginComponent } from '@nexthcm/auth';
import { CoreModule, ROUTER_CONFIG } from '@nexthcm/core';
import { FormlyTaigaUiModule, PortalLayoutComponent, PortalLayoutModule } from '@nexthcm/ui';
import { TuiRootModule } from '@taiga-ui/core';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

registerLocaleData(localeVi);
registerLocaleData(localeEn);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    TuiRootModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(
      [
        { path: 'login', component: LoginComponent },
        {
          path: '',
          component: PortalLayoutComponent,
          children: [
            { path: '', loadChildren: () => import('@nexthcm/home').then((m) => m.HomeModule) },
            { path: 'my-time', loadChildren: () => import('@nexthcm/my-time').then((m) => m.MyTimeModule) },
            { path: 'seat-maps', loadChildren: () => import('@nexthcm/seat-maps').then((m) => m.SeatMapsModule) },
            {
              path: 'notifications',
              loadChildren: () => import('@nexthcm/notifications').then((m) => m.NotificationsModule),
            },
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
                {
                  path: 'offices',
                  loadChildren: () => import('@nexthcm/admin-offices').then((m) => m.AdminOfficesModule),
                },
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
                {
                  path: 'tenants',
                  loadChildren: () => import('@nexthcm/admin-tenants').then((m) => m.AdminTenantsModule),
                },
                {
                  path: 'workflows',
                  loadChildren: () => import('@nexthcm/admin-workflows').then((m) => m.AdminWorkflowsModule),
                },
                {
                  path: 'job-levels',
                  loadChildren: () => import('@nexthcm/admin-job-levels').then((m) => m.AdminJobLevelsModule),
                },
                {
                  path: 'knowledge-base',
                  loadChildren: () => import('@nexthcm/admin-knowledge-base').then((m) => m.AdminKnowledgeBaseModule),
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
                {
                  path: 'task-scheduler',
                  loadChildren: () => import('@nexthcm/admin-task-scheduler').then((m) => m.AdminTaskSchedulerModule),
                },
                {
                  path: 'notifications',
                  loadChildren: () => import('@nexthcm/admin-notifications').then((m) => m.AdminNotificationsModule),
                },
              ],
            },
          ],
        },
      ],
      ROUTER_CONFIG
    ),
    FormlyTaigaUiModule,
    CoreModule.forRoot(environment),
    AuthModule,
    PortalLayoutModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000',
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
