import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PromptComponentModule, ScrollIntoViewDirectiveModule, SkipNavigationDirectiveModule } from '@nexthcm/cdk';
import { SvgIconRegistry, SvgIconsModule } from '@ngneat/svg-icon';
import { TranslocoModule } from '@ngneat/transloco';
import { TuiDataListModule, TuiLinkModule, TuiScrollbarModule } from '@taiga-ui/core';
import { TuiAccordionModule } from '@taiga-ui/kit';
import { NgxPermissionsModule } from 'ngx-permissions';

import { sidebarIcons } from '../../shared/icons/sidebar';
import { PortalLayoutComponent } from './portal-layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [PortalLayoutComponent, SidebarComponent],
  imports: [
    PromptComponentModule,
    RouterModule,
    TuiAccordionModule,
    TuiLinkModule,
    ScrollIntoViewDirectiveModule,
    TuiScrollbarModule,
    TuiDataListModule,
    CommonModule,
    NgxPermissionsModule,
    SvgIconsModule,
    TranslocoModule,
    SkipNavigationDirectiveModule,
  ],
  exports: [PortalLayoutComponent],
})
export class PortalLayoutModule {
  constructor(private registry: SvgIconRegistry) {
    registry.register(sidebarIcons);
  }
}
