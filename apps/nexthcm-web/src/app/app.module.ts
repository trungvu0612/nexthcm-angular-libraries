import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AuthModule, LoginComponent } from '@nexthcm/auth';
import { CoreModule, ROUTER_CONFIG } from '@nexthcm/core';
import { FormlyTaigaUiModule, PortalLayoutComponent, PortalLayoutModule } from '@nexthcm/ui';
import { TuiRootModule } from '@taiga-ui/core';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

const ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: PortalLayoutComponent,
    children: [
      { path: '', loadChildren: () => import('@nexthcm/home').then((m) => m.HomeModule) },
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
            path: 'synchronize-data',
            loadChildren: () => import('@nexthcm/admin-synchronize-data').then((m) => m.AdminSynchronizeDataModule),
          },
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES, ROUTER_CONFIG),
    BrowserAnimationsModule,
    TuiRootModule,
    CoreModule.forRoot(environment),
    FormlyTaigaUiModule,
    AuthModule,
    PortalLayoutModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}