import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { SelectOptionsModule } from '@nexthcm/cdk';
import { BaseFormComponentModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiElementModule, TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiErrorModule,
  TuiLabelModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import { TuiDataListWrapperModule, TuiMultiSelectModule } from '@taiga-ui/kit';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard, NgxPermissionsModule } from 'ngx-permissions';
import { FormlySelectPermissionsComponent } from './components/formly-select-permissions/formly-select-permissions.component';
import { UpsertUserRoleDialogComponent } from './components/upsert-user-roles/upsert-user-role-dialog.component';
import en from './i18n/en.json';
import vi from './i18n/vi.json';
import { UserRoleManagementComponent } from './pages/user-role-management/user-role-management.component';
import { AdminUserRolesService } from './services/admin-user-roles.service';
import { TRANSLATION_SCOPE } from './translation-scope';

export const adminUserRolesRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_ROLE', redirectTo: '/' } },
    children: [
      { path: '', component: UserRoleManagementComponent },
      {
        path: 'add',
        component: UpsertUserRoleDialogComponent,
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
    LayoutModule,
    TuiTextfieldControllerModule,
    NgxPermissionsModule,
    BaseFormComponentModule,
    TuiElementModule,
    PolymorpheusModule,
    TuiErrorModule,
    TuiLabelModule,
    TuiLinkModule,
  ],
  declarations: [UserRoleManagementComponent, UpsertUserRoleDialogComponent, FormlySelectPermissionsComponent],
  providers: [
    AdminUserRolesService,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: { scope: TRANSLATION_SCOPE, loader: { en: () => Promise.resolve(en), vi: () => Promise.resolve(vi) } },
    },
  ],
})
export class AdminUserRolesModule {}
