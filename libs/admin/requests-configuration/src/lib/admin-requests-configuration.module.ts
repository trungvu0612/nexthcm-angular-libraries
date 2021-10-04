import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { WorkflowsEffects } from '@nexthcm/cdk';
import { inlineLoaderFactory } from '@nexthcm/core';
import { BaseFormComponentModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template';
import { TuiLoaderModule } from '@taiga-ui/core';
import { TuiAccordionModule } from '@taiga-ui/kit';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AdminRequestsConfigurationComponent } from './admin-requests-configuration.component';
import { AdminRequestsConfigurationService } from './admin-requests-configuration.service';
import { RequestConfigFormComponent } from './components/request-config-form/request-config-form.component';

export const adminRequestsConfigurationRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_REQUEST_CONFIG_MANAGEMENT', redirectTo: '/' } },
    children: [{ path: '', component: AdminRequestsConfigurationComponent }],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminRequestsConfigurationRoutes),
    LayoutModule,
    AkitaNgEffectsModule.forFeature([WorkflowsEffects]),
    TranslocoModule,
    TuiAccordionModule,
    BaseFormComponentModule,
    TuiLoaderModule,
    LetModule,
  ],
  declarations: [AdminRequestsConfigurationComponent, RequestConfigFormComponent],
  providers: [
    AdminRequestsConfigurationService,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'requestsConfig',
        loader: inlineLoaderFactory((lang) => import(`../../assets/i18n/${lang}.json`)),
      },
    },
  ]
})
export class AdminRequestsConfigurationModule {}
