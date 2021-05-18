import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { FormlyModule } from '@ngx-formly/core';
import { TUI_SANITIZER } from '@taiga-ui/cdk';
import { TuiDialogModule, TuiRootModule } from '@taiga-ui/core';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { LayoutComponent } from '@nexthcm/ui';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('@nexthcm/home').then((m) => m.HomeModule)
      },
      {
        path: 'my-time',
        loadChildren: () => import('@nexthcm/my-time').then((m) => m.MyTimeModule),
      },
      {
        path: 'human-resource',
        loadChildren: () => import('@nexthcm/human-resource').then((m) => m.HumanResourceModule),
      },
    ]
  },

];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes, { initialNavigation: 'enabled' }),
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    ReactiveFormsModule,
    FormlyModule.forRoot({ extras: { lazyRender: true, resetFieldOnHide: true } }),
    BrowserAnimationsModule,
    TuiRootModule,
    TuiDialogModule,
  ],
  providers: [
    {
      provide: TUI_SANITIZER,
      useClass: NgDompurifySanitizer,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
