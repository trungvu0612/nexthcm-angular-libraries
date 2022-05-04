import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BaseFormComponentModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TRANSLOCO_SCOPE, TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { PushModule } from '@rx-angular/template';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiMapperPipeModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiExpandModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiCheckboxModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard, NgxPermissionsModule } from 'ngx-permissions';

import { FormlyPermissionsComponent } from './components/formly-permissions/formly-permissions.component';
import { FormlyServicesComponent } from './components/formly-services/formly-services.component';
import en from './i18n/en.json';
import vi from './i18n/vi.json';
import { PermissionListComponent } from './pages/permission-list/permission-list.component';
import { UpsertPermissionComponent } from './pages/upsert-permission/upsert-permission.component';
import { AdminPermissionsService } from './services/admin-permissions.service';

export const adminPermissionsRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_PERMISSION', redirectTo: '/' } },
    children: [
      { path: '', component: PermissionListComponent },
      {
        path: 'add',
        component: UpsertPermissionComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'CREATE_PERMISSION', redirectTo: '/' } },
      },
      {
        path: ':id/edit',
        component: UpsertPermissionComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'UPDATE_PERMISSION', redirectTo: '/' } },
      },
    ],
  },
];

@NgModule({
  declarations: [
    PermissionListComponent,
    UpsertPermissionComponent,
    FormlyServicesComponent,
    FormlyPermissionsComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(adminPermissionsRoutes),
    ReactiveFormsModule,
    FormlyModule.forChild({
      types: [
        { name: 'services', component: FormlyServicesComponent },
        { name: 'permissions', component: FormlyPermissionsComponent },
      ],
    }),
    TranslocoModule,
    TuiExpandModule,
    TableModule,
    TuiTablePaginationModule,
    TuiButtonModule,
    LayoutModule,
    TuiLoaderModule,
    NgxPermissionsModule,
    PushModule,
    BaseFormComponentModule,
    TuiCheckboxModule,
    TuiMapperPipeModule,
  ],
  providers: [
    AdminPermissionsService,
    {
      provide: TRANSLOCO_SCOPE,
      useValue: { scope: 'permissions', loader: { en: () => Promise.resolve(en), vi: () => Promise.resolve(vi) } },
    },
  ],
})
export class AdminPermissionsModule {}
