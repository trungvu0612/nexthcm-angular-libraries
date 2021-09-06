import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Route } from '@angular/router';
import { LayoutComponent } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiTagModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { PeriodManagementComponent } from './pages/period-management/period-management.component';
import { UpsertPeriodDialogComponent } from './components/upsert-period-dialog/upsert-period-dialog.component';

export const adminPeriodRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'ADMIN', redirectTo: '/' } }, // TODO need fix
    children: [{ path: '', component: PeriodManagementComponent }],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminPeriodRoutes),
    FormlyModule,
    ReactiveFormsModule,
    TuiTablePaginationModule,
    TuiLoaderModule,
    TableModule,
    TranslocoModule,
    TuiButtonModule,
    TuiTagModule,
  ],
  declarations: [PeriodManagementComponent, UpsertPeriodDialogComponent],
})
export class AdminPeriodModule {}
