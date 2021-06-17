import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TuiDataListModule, TuiHostedDropdownModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiAccordionModule, TuiAvatarModule, TuiBreadcrumbsModule } from '@taiga-ui/kit';
import { AdminLayoutComponent } from './admin-layout.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminMenuLeftComponent } from './admin-menu-left/admin-menu-left.component';

@NgModule({
  declarations: [AdminLayoutComponent, AdminMenuLeftComponent, AdminHeaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    TuiSvgModule,
    TuiAccordionModule,
    TuiBreadcrumbsModule,
    TuiHostedDropdownModule,
    TuiAvatarModule,
    TuiDataListModule,
  ],
  exports: [AdminLayoutComponent, AdminHeaderComponent],
})
export class AdminLayoutModule {}