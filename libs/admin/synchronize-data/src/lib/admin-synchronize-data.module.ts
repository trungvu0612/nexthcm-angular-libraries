import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { TuiLetModule, TuiMapperPipeModule } from '@taiga-ui/cdk';
import { TuiDataListModule, TuiLoaderModule, TuiTextfieldControllerModule } from '@taiga-ui/core';
import { TuiCheckboxModule, TuiInputModule, TuiSelectModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { SynchronizeSettingsComponent } from './pages/synchronize-settings/synchronize-settings.component';

export const adminSynchronizeDataRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    data: { permissions: { only: 'VIEW_ADMIN_CONFIG_TIME', redirectTo: '/' } },
    children: [{ path: '', component: SynchronizeSettingsComponent }],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminSynchronizeDataRoutes),
    TuiMapperPipeModule,
    TableModule,
    LayoutModule,
    TranslocoModule,
    TuiSelectModule,
    TuiDataListModule,
    FormsModule,
    TuiLoaderModule,
    TuiLetModule,
    TuiTextfieldControllerModule,
    TuiInputModule,
    TuiCheckboxModule,
    ReactiveFormsModule,
  ],
  declarations: [SynchronizeSettingsComponent],
})
export class AdminSynchronizeDataModule {}
