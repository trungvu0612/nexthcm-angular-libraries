import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { AuthModule } from '@nexthcm/auth';
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
        {
          path: 'admin/processes',
          loadChildren: () => import('@nexthcm/admin-processes').then((m) => m.AdminProcessesModule),
        },
        { path: '', redirectTo: 'admin/processes', pathMatch: 'full' },
      ],
      { initialNavigation: 'enabled' }
    ),
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