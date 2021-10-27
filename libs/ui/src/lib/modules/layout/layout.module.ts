import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { GetFilePipeModule, SkipNavigationDirectiveModule } from '@nexthcm/cdk';
import { SvgIconsModule } from '@ngneat/svg-icon';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template';
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
import { AvatarComponentModule } from '../../components';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout.component';
import { PageComponent } from './page/page.component';

@NgModule({
  declarations: [LayoutComponent, HeaderComponent, PageComponent],
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
    LetModule,
    GetFilePipeModule,
    AvatarComponentModule,
  ],
  exports: [LayoutComponent, PageComponent],
})
export class LayoutModule {}
