import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
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
        path: 'admin/workflow',
        loadChildren: () => import('@nexthcm/admin-workflows').then((m) => m.AdminWorkflowsModule),
      },
      { path: '', redirectTo: 'admin/workflow', pathMatch: 'full' },
    ]),
    BrowserAnimationsModule,
    TuiRootModule,
    CoreModule.forRoot(environment),
    FormlyTaigaUiModule,
    AuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
