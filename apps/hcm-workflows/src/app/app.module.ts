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
    RouterModule.forRoot([
      {
        path: 'auth',
        children: [
          { path: 'login', component: LoginComponent },
          { path: 'logout', component: LogoutComponent },
          { path: '', redirectTo: 'login', pathMatch: 'full' },
        ],
      },
      {
        path: 'admin/workflows',
        loadChildren: () => import('@nexthcm/admin-workflows').then((m) => m.AdminWorkflowsModule),
      },
      {
        path: 'admin/employees',
        loadChildren: () => import('@nexthcm/admin-employees').then((m) => m.AdminEmployeesModule),
      },
      {
        path: 'admin/working-times',
        loadChildren: () => import('@nexthcm/admin-working-times').then((m) => m.AdminWorkingTimesModule),
      },
      { path: '', redirectTo: 'admin/workflows', pathMatch: 'full' },
    ]),
    BrowserAnimationsModule,
    TuiRootModule,
    CoreModule.forRoot(environment),
    FormlyTaigaUiModule,
    AuthModule,
    environment.production ? [] : AkitaNgDevtools.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
