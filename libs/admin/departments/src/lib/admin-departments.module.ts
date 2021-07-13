import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { AuthGuard } from '@nexthcm/auth';
import { LayoutComponent } from '@nexthcm/ui';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiSvgModule } from '@taiga-ui/core';
import { AdminDepartmentsComponent } from './admin-departments.component';
import { RepeatDepartmentsComponent } from './components/repeat-departments/repeat-departments.component';
import { ListDepartmentComponent } from './pages/list-department/list-department.component';
import { UpsertDepartmentComponent } from './pages/upsert-department/upsert-department.component';

export const adminDepartmentsRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ListDepartmentComponent },
      { path: 'add', component: UpsertDepartmentComponent },
      { path: ':id/edit', component: UpsertDepartmentComponent },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminDepartmentsRoutes),
    FormlyModule.forChild({
      types: [{ name: 'repeat1', component: RepeatDepartmentsComponent }],
    }),
    TuiButtonModule,
    TuiTableModule,
    TuiSvgModule,
    TuiTablePaginationModule,
    ReactiveFormsModule,
    TuiLetModule,
  ],
  declarations: [
    AdminDepartmentsComponent,
    ListDepartmentComponent,
    UpsertDepartmentComponent,
    RepeatDepartmentsComponent,
  ],
})
export class AdminDepartmentsModule {}
