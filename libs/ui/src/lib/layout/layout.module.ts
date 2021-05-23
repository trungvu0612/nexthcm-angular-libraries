import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiDataListModule, TuiDropdownModule, TuiSvgModule } from '@taiga-ui/core';
import { LayoutComponent } from './layout.component';
import { MenuLeftComponent } from './menu-left/menu-left.component';
import { HeaderComponent } from './header/header.component';
import { TuiAvatarModule, TuiTabsModule } from '@taiga-ui/kit';

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
  ],
  exports: [LayoutComponent, HeaderComponent],
})
export class LayoutModule {}
