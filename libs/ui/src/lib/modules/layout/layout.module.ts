import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PromptComponentModule, SkipNavigationDirectiveModule } from '@nexthcm/cdk';
import { SvgIconRegistry, SvgIconsModule } from '@ngneat/svg-icon';
import { TranslocoModule } from '@ngneat/transloco';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownModule,
  TuiHostedDropdownModule,
  TuiScrollbarModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { TuiAvatarModule, TuiTabsModule } from '@taiga-ui/kit';
import { NgxPermissionsModule } from 'ngx-permissions';
import { sidebarIcons } from '../../shared/icons/sidebar';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
  declarations: [LayoutComponent, HeaderComponent, SidebarComponent],
  imports: [
    CommonModule,
    RouterModule,
    TuiDataListModule,
    TuiDropdownModule,
    TuiTabsModule,
    TuiAvatarModule,
    TuiSvgModule,
    TranslocoModule,
    TuiHostedDropdownModule,
    TuiButtonModule,
    SvgIconsModule,
    TuiScrollbarModule,
    SkipNavigationDirectiveModule,
    NgxPermissionsModule,
    PromptComponentModule,
  ],
  exports: [LayoutComponent],
})
export class LayoutModule {
  constructor(private registry: SvgIconRegistry) {
    registry.register(sidebarIcons);
  }
}
