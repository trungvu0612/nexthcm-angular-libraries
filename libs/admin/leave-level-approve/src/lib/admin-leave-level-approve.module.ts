import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Route, RouterModule } from '@angular/router';
import { AdminPermissionsService } from '@nexthcm/admin-permissions';
import { SelectOptionsModule } from '@nexthcm/cdk';
import { LayoutComponent } from '@nexthcm/ui';
import { FormlyModule } from '@ngx-formly/core';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiDataListModule, TuiSvgModule } from '@taiga-ui/core';
import { TuiDataListWrapperModule, TuiMultiSelectModule } from '@taiga-ui/kit';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { FormlySelectJobTitlesComponent } from './components/formly-select-job-titles/formly-select-job-titles.component';
import { EditLeaveLevelApproveComponent } from './pages/edit-leave-level-approve/edit-leave-level-approve.component';
import { ListLeaveLevelApproveComponent } from './pages/list-leave-level-approve/list-leave-level-approve.component';
import { UpsertLeaveLevelApproveComponent } from './pages/upsert-leave-level-approve/upsert-leave-level-approve.component';
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
    FormlySelectJobTitlesComponent,
    EditLeaveLevelApproveComponent
  ],
  providers: [
    AdminPermissionsService,
    LevelApproveService
  ]
})
export class AdminLeaveLevelApproveModule {
}
