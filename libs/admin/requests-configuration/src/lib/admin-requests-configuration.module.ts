import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { WorkflowsEffects } from '@nexthcm/cdk';
import { inlineLoaderFactory } from '@nexthcm/core';
import { BaseFormComponentModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { WorkflowDesignerModule } from '@nexthcm/workflow-designer';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { LetModule } from '@rx-angular/template';
import { TuiButtonModule, TuiGroupModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiAccordionModule } from '@taiga-ui/kit';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AdminRequestsConfigurationComponent } from './admin-requests-configuration.component';
import { AdminRequestsConfigurationService } from './admin-requests-configuration.service';
import { FormlyViewWorkflowButtonComponent } from './components/formly-view-workflow-button/formly-view-workflow-button.component';
import { RequestConfigFormComponent } from './components/request-config-form/request-config-form.component';
import { ViewWorkflowDialogComponent } from './components/view-workflow-dialog/view-workflow-dialog.component';

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
    WorkflowDesignerModule,
    TuiButtonModule,
    FormlyModule.forChild({
      types: [{ name: 'view-workflow-button', component: FormlyViewWorkflowButtonComponent }],
    }),
    TuiGroupModule,
  ],
  declarations: [
    AdminRequestsConfigurationComponent,
    RequestConfigFormComponent,
    FormlyViewWorkflowButtonComponent,
    ViewWorkflowDialogComponent,
  ],
  providers: [
    AdminRequestsConfigurationService,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: {
        scope: 'requestsConfig',
        loader: inlineLoaderFactory((lang) => import(`../../assets/i18n/${lang}.json`)),
      },
    },
  ],
})
export class AdminRequestsConfigurationModule {}
