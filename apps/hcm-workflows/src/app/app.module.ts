import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@nexthcm/core';
import { FormlyTaigaUiModule } from '@nexthcm/ui';
import { TuiRootModule } from '@taiga-ui/core';
import { environment } from '../../../hcm-web/src/environments/environment';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(
      [
        {
          path: '',
          loadChildren: () => import('@nexthcm/admin-workflows').then((m) => m.AdminWorkflowsModule),
        },
      ],
      { initialNavigation: 'enabled' }
    ),
    BrowserAnimationsModule,
    TuiRootModule,
    CoreModule.forRoot(environment),
    FormlyTaigaUiModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
