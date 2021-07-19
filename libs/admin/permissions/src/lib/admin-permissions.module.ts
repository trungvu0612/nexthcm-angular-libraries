import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LayoutComponent, PromptComponentModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownControllerModule,
  TuiExpandModule,
  TuiHostedDropdownModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiDataListWrapperModule,
  TuiDropdownHoverModule,
  TuiFilterModule,
  TuiInputModule,
  TuiMultiSelectModule,
  TuiStepperModule,
} from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { InputActionsComponent } from './components/input-actions/input-actions.type';
import { InputServiceComponent } from './components/input-service/input-service.type';
import { PermissionDetailComponent } from './components/permission-detail/permission-detail.component';
import { RepeatServiceComponent } from './components/repeat-service/repeat-service.type';
import { SelectResourcesComponent } from './components/select-resources/select-resources.component';
import { CreatePermissionComponent } from './pages/create-permission/create-permission.component';
import { PermissionListComponent } from './pages/permission-list/permission-list.component';
import { UpdatePermissionComponent } from './pages/update-permission/update-permission.component';
import { AdminPermissionsService } from './services/admin-permissions.service';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@nexthcm/auth';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: PermissionListComponent },
      { path: 'create', component: CreatePermissionComponent },
      { path: 'update/:id', component: UpdatePermissionComponent },
    ],
  },
];

@NgModule({
  declarations: [
    PermissionListComponent,
    CreatePermissionComponent,
    RepeatServiceComponent,
    InputServiceComponent,
    InputActionsComponent,
    UpdatePermissionComponent,
    SelectResourcesComponent,
    PermissionDetailComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,

    FormlyModule.forChild({
      types: [
        { name: 'repeat-service', component: RepeatServiceComponent },
        { name: 'input-service', component: InputServiceComponent },
        { name: 'input-actions', component: InputActionsComponent },
      ],
    }),
    TranslocoModule,
    TuiSvgModule,
    TuiStepperModule,
    TuiExpandModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiHostedDropdownModule,
    TuiDropdownControllerModule,
    TuiDropdownHoverModule,
    TuiMultiSelectModule,
    TuiDataListWrapperModule,
    TuiDataListModule,
    PromptComponentModule,
    TuiFilterModule,
    TuiLetModule,
    TableModule,
    TuiTablePaginationModule,
    TuiButtonModule,
  ],
  providers: [AdminPermissionsService],
})
export class AdminPermissionsModule {}
