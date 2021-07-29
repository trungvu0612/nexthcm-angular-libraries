import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Route } from '@angular/router';
import { ListLeaveLevelApproveComponent } from './pages/list-leave-level-approve/list-leave-level-approve.component';
import { UpsertLeaveLevelApproveComponent } from './pages/upsert-leave-level-approve/upsert-leave-level-approve.component';
import { LayoutComponent, SelectOptionsModule } from '@nexthcm/ui';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { ReactiveFormsModule } from '@angular/forms';
import { TuiDataListWrapperModule, TuiMultiSelectModule } from '@taiga-ui/kit';
import { TuiDataListModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { FormlyModule } from '@ngx-formly/core';
import { FormlySelectPermissionsComponent } from '../../../user-roles/src/lib/components/formly-select-permissions/formly-select-permissions.component';
import { FormlySelectJobTitlesComponent } from './components/formly-select-job-titles/formly-select-job-titles.component';
import { AdminPermissionsService } from '@nexthcm/admin-permissions';
import { LevelApproveService } from './services/level-approve.service';

export const adminLeaveLevelApproveRoutes: Route[] = [
  {
    path: '',
    component: LayoutComponent,
    canActivate: [NgxPermissionsGuard],
    /*TODO need fix*/
    data: { permissions: { only: 'ADMIN', redirectTo: '/' } },
    children: [
      { path: '', component: ListLeaveLevelApproveComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminLeaveLevelApproveRoutes),
    FormlyModule.forChild({ types: [{ name: 'select-permissions1', component: FormlySelectJobTitlesComponent }] }),
    ReactiveFormsModule,
    TuiMultiSelectModule,
    TuiDataListWrapperModule,
    TuiDataListModule,
    TuiLetModule,
    SelectOptionsModule,
    TuiTableModule,
    TuiSvgModule,
    TuiTablePaginationModule
  ],
  declarations: [
    ListLeaveLevelApproveComponent,
    UpsertLeaveLevelApproveComponent,
    FormlySelectJobTitlesComponent
  ],
  providers: [
    AdminPermissionsService,
    LevelApproveService
  ]
})
export class AdminLeaveLevelApproveModule {
}
