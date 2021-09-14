import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { WorkflowsEffects } from '@nexthcm/cdk';
import { BaseFormComponentModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { TuiLoaderModule } from '@taiga-ui/core';
import { TuiAccordionModule } from '@taiga-ui/kit';
import { AdminRequestsConfigurationComponent } from './admin-requests-configuration.component';

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
  ],
  declarations: [AdminRequestsConfigurationComponent],
})
export class AdminRequestsConfigurationModule {}
