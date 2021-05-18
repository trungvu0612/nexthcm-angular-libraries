import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuLeftComponent } from './menu-left/menu-left.component';
import { LayoutComponent } from './layout.component';
import { RouterModule } from '@angular/router';
import {
  TuiButtonModule, TuiDataListModule,
  TuiDropdownControllerModule,
  TuiDropdownModule,
  TuiHostedDropdownModule
} from '@taiga-ui/core';
import { TuiActiveZoneModule } from '@taiga-ui/cdk';

@NgModule({
  declarations: [MenuLeftComponent, LayoutComponent],
  imports: [CommonModule, RouterModule, TuiHostedDropdownModule, TuiButtonModule, TuiActiveZoneModule, TuiDropdownModule, TuiDropdownControllerModule, TuiDropdownModule, TuiDropdownModule, TuiDataListModule, TuiDropdownModule, TuiDropdownModule, TuiDropdownModule, TuiDropdownModule, TuiDropdownModule, TuiButtonModule, TuiDropdownModule, TuiDropdownModule, TuiDropdownModule, TuiDropdownModule],
  exports: [MenuLeftComponent, LayoutComponent],
})
export class LayoutModule {}
