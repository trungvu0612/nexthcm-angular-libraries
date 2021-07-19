import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SvgIconsModule } from '@ngneat/svg-icon';
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
import { SkipNavigationDirectiveModule } from '../../directives';
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
    SvgIconsModule.forChild(sidebarIcons),
    TuiScrollbarModule,
    SkipNavigationDirectiveModule,
    NgxPermissionsModule,
  ],
  exports: [LayoutComponent],
})
export class LayoutModule {}
