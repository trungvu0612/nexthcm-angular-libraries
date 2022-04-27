import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { LetModule } from '@rx-angular/template';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiHostedDropdownModule,
  TuiScrollbarModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { TuiTabsModule } from '@taiga-ui/kit';
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
    AvatarComponentModule,
    TranslocoModule,
    NgxPermissionsModule,
    LetModule,
    TuiTabsModule,
    TuiDataListModule,
    TuiSvgModule,
    TuiHostedDropdownModule,
    TuiButtonModule,
    TuiScrollbarModule,
  ],
  exports: [LayoutComponent, PageComponent],
})
export class LayoutModule {}
