import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { FormlyTaigaUiModule, LayoutComponent, PromptComponentModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiMarkerIconModule, TuiTagModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { LeaveTypesComponent } from './leave-types.component';
import { ListLeaveTypeComponent } from './pages/list-leave-type/list-leave-type.component';
import { UpsertLeaveTypeComponent } from './pages/upsert-leave-type/upsert-leave-type.component';

export const adminLeaveTypesRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_LEAVE_TYPE', redirectTo: '/' } },
    children: [
      {
        path: '',
        component: LeaveTypesComponent,
        children: [
          { path: '', component: ListLeaveTypeComponent },
          {
            path: 'add',
            component: UpsertLeaveTypeComponent,
            canActivate: [NgxPermissionsGuard],
            // data: { permissions: { only: 'CREATE_LEAVE_TYPE', redirectTo: '/' } },
            data: { permissions: { only: 'VIEW_EMPLOYEE', redirectTo: '/' } },
          },
          {
            path: ':id/edit',
            component: UpsertLeaveTypeComponent,
            canActivate: [NgxPermissionsGuard],
            // data: { permissions: { only: 'UPDATE_LEAVE_TYPE', redirectTo: '/' } },
            data: { permissions: { only: 'VIEW_EMPLOYEE', redirectTo: '/' } },
          },
        ],
      },
    ],
  },
];

@NgModule({
  declarations: [LeaveTypesComponent, ListLeaveTypeComponent, UpsertLeaveTypeComponent],
  imports: [
    CommonModule,
    RouterModule,
    RouterModule.forChild(adminLeaveTypesRoutes),
    TuiTableModule,
    TuiTablePaginationModule,
    TuiButtonModule,
    TableModule,
    TuiTagModule,
    TuiLoaderModule,
    FormlyModule,
    FormlyTaigaUiModule,
    TuiMarkerIconModule,
    PromptComponentModule,
    TranslocoModule,
    ReactiveFormsModule,
  ],
})
export class AdminLeaveTypesModule {}
