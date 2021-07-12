import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { LayoutComponent, SelectOptionsModule } from '@nexthcm/ui';
import { AuthGuard } from '@nexthcm/auth';
import { ListUserRolesComponent } from './pages/list-user-roles/list-user-roles.component';
import { UpsertUserRolesComponent } from './pages/upsert-user-roles/upsert-user-roles.component';
import { AdminUserRolesComponent } from './admin-user-roles.component';
import { FormlyModule } from '@ngx-formly/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlySelectPermissionsComponent } from './components/formly-select-permissions/formly-select-permissions.component';
import { TuiDataListWrapperModule, TuiMultiSelectModule } from '@taiga-ui/kit';
import { TuiDataListModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { AdminPermissionsService } from '../../../permissions/src/lib/services/admin-permissions.service';

export const adminUserRolesRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ListUserRolesComponent },
      { path: 'add', component: UpsertUserRolesComponent },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminUserRolesRoutes),
    FormlyModule.forChild({ types: [{ name: 'select-permissions', component: FormlySelectPermissionsComponent }] }),
    ReactiveFormsModule,
    TuiMultiSelectModule,
    TuiDataListWrapperModule,
    TuiDataListModule,
    TuiLetModule,
    SelectOptionsModule,
    TuiTableModule,
    TuiSvgModule,
    TuiTablePaginationModule,
  ],
  declarations: [
    ListUserRolesComponent,
    UpsertUserRolesComponent,
    AdminUserRolesComponent,
    FormlySelectPermissionsComponent,
  ],
  providers: [AdminPermissionsService],
})
export class AdminUserRolesModule {}
