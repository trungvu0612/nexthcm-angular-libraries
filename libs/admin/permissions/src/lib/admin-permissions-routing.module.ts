import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from '@nexthcm/ui';
import { AdminPermissionsComponent } from './admin-permissions.component';
import { CreatePermissionComponent } from './pages/create-permission/create-permission.component';
import { PermissionListComponent } from './pages/permission-list/permission-list.component';
import { UpdatePermissionComponent } from './pages/update-permission/update-permission.component';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        component: AdminPermissionsComponent,
        children: [
          {
            path: '',
            component: PermissionListComponent,
          },
          {
            path: 'create',
            component: CreatePermissionComponent,
          },
          {
            path: 'update/:id',
            component: UpdatePermissionComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminPermissionsRoutingModule {}
