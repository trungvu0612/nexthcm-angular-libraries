import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiMarkerIconModule, TuiTagModule } from '@taiga-ui/kit';
import { ReactiveFormsModule } from '@angular/forms';
import { LeaveTypesComponent } from './leave-types.component';
import { ListLeaveTypeComponent } from './pages/list-leave-type/list-leave-type.component';
import { UpsertLeaveTypeComponent } from './pages/upsert-leave-type/upsert-leave-type.component';
import { FormlyTaigaUiModule, LayoutComponent, PromptComponentModule } from '@nexthcm/ui';
import { TableModule } from 'ngx-easy-table';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';

export const adminLeaveTypesRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: LeaveTypesComponent,
        children: [
          { path: '', component: ListLeaveTypeComponent },
          { path: 'add', component: UpsertLeaveTypeComponent },
          { path: ':id/edit', component: UpsertLeaveTypeComponent },
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
