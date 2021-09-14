import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { WorkflowsEffects } from '@nexthcm/cdk';
import { BaseFormComponentModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template';
import { TuiLoaderModule } from '@taiga-ui/core';
import { TuiAccordionModule } from '@taiga-ui/kit';
import { AdminRequestsConfigurationComponent } from './admin-requests-configuration.component';
import { RequestConfigFormComponent } from './components/request-config-form/request-config-form.component';

export const adminRequestsConfigurationRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
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
})
export class AdminRequestsConfigurationModule {}
