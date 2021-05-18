import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TuiDataListModule, TuiDropdownModule } from '@taiga-ui/core';
import { LayoutComponent } from './layout.component';
import { MenuLeftComponent } from './menu-left/menu-left.component';

@NgModule({
  declarations: [MenuLeftComponent, LayoutComponent],
  imports: [CommonModule, RouterModule, TuiDataListModule, TuiDropdownModule],
  exports: [LayoutComponent],
})
export class LayoutModule {}
