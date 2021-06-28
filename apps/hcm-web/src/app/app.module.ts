import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AuthModule, LoginComponent } from '@nexthcm/auth';
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
        { path: 'auth', component: LoginComponent },
        { path: '', loadChildren: () => import('@nexthcm/home').then((m) => m.HomeModule) },
        { path: 'my-time', loadChildren: () => import('@nexthcm/my-time').then((m) => m.MyTimeModule) },
        { path: 'help-desk', loadChildren: () => import('@nexthcm/help-desk').then((m) => m.HelpDeskModule) },
        {
          path: 'human-resource',
          loadChildren: () => import('@nexthcm/human-resource').then((m) => m.HumanResourceModule),
        },
        { path: 'policy', loadChildren: () => import('@nexthcm/policy').then((m) => m.PolicyModule) },
        {
          path: 'admin',
          children: [
            { path: '', loadChildren: () => import('@nexthcm/admin-tenant').then((m) => m.AdminTenantModule) },
            { path: 'offices', loadChildren: () => import('@nexthcm/admin-offices').then((m) => m.AdminOfficesModule) },
            {
              path: 'permissions',
              loadChildren: () => import('@nexthcm/admin-permissions').then((m) => m.AdminPermissionsModule),
            },
            {
              path: 'employees',
              loadChildren: () => import('@nexthcm/admin-employee').then((m) => m.AdminEmployeeModule),
            },
            { path: 'tenant', loadChildren: () => import('@nexthcm/admin-tenant').then((m) => m.AdminTenantModule) },
            {
              path: 'job-level',
              loadChildren: () => import('@nexthcm/admin-job-level').then((m) => m.AdminJobLevelModule),
            },
            {
              path: 'policies',
              loadChildren: () => import('@nexthcm/admin-policies').then((m) => m.AdminPoliciesModule),
            },
          ],
        },
      ],
      { initialNavigation: 'enabled' }
    ),
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    BrowserAnimationsModule,
    TuiRootModule,
    FormlyTaigaUiModule,
    CoreModule.forRoot(environment),
    AuthModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
