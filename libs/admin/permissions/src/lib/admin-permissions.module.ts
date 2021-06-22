import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule } from '@taiga-ui/addon-table';
import {
  TuiDropdownControllerModule,
  TuiExpandModule,
  TuiHostedDropdownModule,
  TuiSvgModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiCheckboxLabeledModule,
  TuiDropdownHoverModule,
  TuiFilterModule,
  TuiInputModule,
  TuiStepperModule,
} from '@taiga-ui/kit';
import { of } from 'rxjs';
import { AdminPermissionsRoutingModule } from './admin-permissions-routing.module';
import { AdminPermissionsComponent } from './admin-permissions.component';
import { InputActionsComponent } from './components/input-actions/input-actions.type';
import { InputServiceComponent } from './components/input-service/input-service.type';
import { RepeatServiceComponent } from './components/repeat-service/repeat-service.type';
import { CreatePermissionComponent } from './pages/create-permission/create-permission.component';
import { PermissionListComponent } from './pages/permission-list/permission-list.component';
import { UpdatePermissionComponent } from './pages/update-permission/update-permission.component';

@NgModule({
  declarations: [
    AdminPermissionsComponent,
    PermissionListComponent,
    CreatePermissionComponent,
    RepeatServiceComponent,
    InputServiceComponent,
    InputActionsComponent,
    UpdatePermissionComponent,
  ],
  imports: [
    CommonModule,
    AdminPermissionsRoutingModule,
    TranslocoModule,
    TuiTableModule,
    TuiSvgModule,
    TuiStepperModule,
    FormlyModule.forChild({
      types: [
        { name: 'repeat-service', component: RepeatServiceComponent },
        {
          name: 'input-service',
          component: InputServiceComponent,
        },
        {
          name: 'input-actions',
          component: InputActionsComponent,
        },
      ],
      validationMessages: [
        { name: 'required', message: 'This field is required' },
        {
          name: 'textPermission',
          message: (maxCharacters: number) =>
            of("Use alphanumeric and '+=,.@-_' characters. Maximum " + maxCharacters + ' characters.'),
        },
      ],
    }),
    ReactiveFormsModule,
    TuiExpandModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    TuiHostedDropdownModule,
    TuiDropdownControllerModule,
    TuiDropdownHoverModule,
    TuiCheckboxLabeledModule,
    TuiFilterModule,
  ],
})
export class AdminPermissionsModule {}
