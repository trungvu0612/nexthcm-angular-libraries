import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { SelectOptionsModule } from '@nexthcm/cdk';
import { LayoutComponent } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiDataListModule, TuiLoaderModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiDataListWrapperModule, TuiMultiSelectModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
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
    TuiLoaderModule,
    TableModule,
    TuiTablePaginationModule,
    TranslocoModule,
    TuiButtonModule,
  ],
  declarations: [
    ListUserRolesComponent,
    UpsertUserRolesComponent,
    AdminUserRolesComponent,
    FormlySelectPermissionsComponent,
  ],
})
export class AdminUserRolesModule {}
