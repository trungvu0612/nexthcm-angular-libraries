import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiDataListModule, TuiDropdownModule, TuiHostedDropdownModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiAccordionModule, TuiAvatarModule, TuiBreadcrumbsModule } from '@taiga-ui/kit';
import { PromptComponentModule } from '../components/prompt/prompt.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminLayoutComponent } from './admin-layout.component';
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
    TuiDropdownModule,
    PromptComponentModule,
  ],
  exports: [AdminLayoutComponent],
})
export class AdminLayoutModule {}
