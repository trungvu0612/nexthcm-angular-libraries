import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { OfficesComponent } from './pages/offices/offices.component';
import { AdminOfficesService } from './services/admin-offices.service';

export const adminOfficesRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_OFFICE', redirectTo: '/' } },
    children: [{ path: '', component: OfficesComponent }],
  },
];

@NgModule({
  declarations: [OfficesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(adminOfficesRoutes),
    TranslocoModule,
    FormlyModule,
    ReactiveFormsModule,
    TuiTableModule,
    TuiTablePaginationModule,
    TuiSvgModule,
    TuiButtonModule,
    TableModule,
    TuiLetModule,
  ],
  providers: [AdminOfficesService],
})
export class AdminOfficesModule {}
