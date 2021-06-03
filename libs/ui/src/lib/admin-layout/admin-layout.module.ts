import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TuiSvgModule } from '@taiga-ui/core';
import { AdminLayoutComponent } from './admin-layout.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';
import { AdminMenuLeftComponent } from './admin-menu-left/admin-menu-left.component';

@NgModule({
  declarations: [AdminLayoutComponent, AdminMenuLeftComponent, AdminHeaderComponent],
  imports: [CommonModule, RouterModule, TuiSvgModule],
  exports: [AdminLayoutComponent, AdminHeaderComponent],
})
export class AdminLayoutModule {}
