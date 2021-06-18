import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownModule,
  TuiHostedDropdownModule,
  TuiSvgModule,
} from '@taiga-ui/core';
import { TuiAvatarModule, TuiTabsModule } from '@taiga-ui/kit';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout.component';
import { MenuLeftComponent } from './menu-left/menu-left.component';

@NgModule({
  declarations: [MenuLeftComponent, LayoutComponent, HeaderComponent],
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
  ],
  exports: [LayoutComponent],
})
export class LayoutModule {}
