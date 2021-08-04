import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { LayoutComponent } from '@nexthcm/ui';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { UpsertLeaveLevelApproveDialogComponent } from './components/upsert-leave-level-approve/upsert-leave-level-approve-dialog.component';
import { AdminLeaveLevelApproveService } from './services/admin-leave-level-approve.service';
import { LeaveLevelApproveManagementComponent } from './pages/leave-level-approve-management/leave-level-approve-management.component';
import { TableModule } from 'ngx-easy-table';
import { TranslocoModule } from '@ngneat/transloco';

export const adminLeaveLevelApproveRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'ADMIN', redirectTo: '/' } }, // TODO need fix
    children: [{ path: '', component: LeaveLevelApproveManagementComponent }],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminLeaveLevelApproveRoutes),
    FormlyModule,
    ReactiveFormsModule,
    TuiTablePaginationModule,
    TuiLoaderModule,
    TableModule,
    TranslocoModule,
    TuiButtonModule,
  ],
  declarations: [
    UpsertLeaveLevelApproveDialogComponent,
    LeaveLevelApproveManagementComponent,
  ],
  providers: [AdminLeaveLevelApproveService],
})
export class AdminLeaveLevelApproveModule {}
