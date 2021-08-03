import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { AdminPermissionsService } from '@nexthcm/admin-permissions';
import { SelectOptionsModule } from '@nexthcm/cdk';
import { LayoutComponent } from '@nexthcm/ui';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiDataListModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiDataListWrapperModule, TuiMultiSelectModule } from '@taiga-ui/kit';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AdminUserRolesComponent } from './admin-user-roles.component';
import { FormlySelectPermissionsComponent } from './components/formly-select-permissions/formly-select-permissions.component';
import { ListUserRolesComponent } from './pages/list-user-roles/list-user-roles.component';
import { UpsertUserRolesComponent } from './pages/upsert-user-roles/upsert-user-roles.component';

export const adminUserRolesRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_ROLE', redirectTo: '/' } },
    children: [
      { path: '', component: ListUserRolesComponent },
      {
        path: 'add',
        component: UpsertUserRolesComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'CREATE_ROLE', redirectTo: '/' } },
      },
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
