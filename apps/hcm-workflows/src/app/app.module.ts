import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AuthModule, LoginComponent } from '@nexthcm/auth';
import { CoreModule, ROUTER_CONFIG } from '@nexthcm/core';
import { FormlyTaigaUiModule, PortalLayoutComponent, PortalLayoutModule } from '@nexthcm/ui';
import { TuiRootModule } from '@taiga-ui/core';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      [
        { path: 'login', component: LoginComponent },
        {
          path: '',
          component: PortalLayoutComponent,
          children: [
            { path: '', loadChildren: () => import('@nexthcm/home').then((m) => m.HomeModule) },
            {
              path: 'admin',
              children: [
                {
                  path: 'workflows',
                  loadChildren: () => import('@nexthcm/admin-workflows').then((m) => m.AdminWorkflowsModule),
                },
                {
                  path: 'requests-config',
                  loadChildren: () =>
                    import('@nexthcm/admin-requests-configuration').then((m) => m.AdminRequestsConfigurationModule),
                },
              ],
            },
          ],
        },
      ],
      ROUTER_CONFIG
    ),
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
