import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BaseFormComponentModule, LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { WorkflowDesignerModule } from '@nexthcm/workflow-designer';
import { TranslocoModule } from '@ngneat/transloco';
import { FormlyModule } from '@ngx-formly/core';
import { LetModule } from '@rx-angular/template';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiActiveZoneModule, TuiLetModule } from '@taiga-ui/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiHostedDropdownModule,
  TuiLabelModule,
  TuiLoaderModule,
} from '@taiga-ui/core';
import {
  TuiCheckboxModule,
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiIslandModule,
  TuiStringifyContentPipeModule,
} from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AdminWorkflowComponent } from './admin-workflow.component';
import { AddStatusDropdownButtonComponent } from './components/add-status-button-dropdown/add-status-dropdown-button.component';
import { CreateWorkflowDialogComponent } from './components/create-workflow-dialog/create-workflow-dialog.component';
import { UpsertStatusDialogComponent } from './components/upsert-status-dialog/upsert-status-dialog.component';
import { UpsertTransitionDialogComponent } from './components/upsert-transition-dialog/upsert-transition-dialog.component';
import { UpsertWorkflowComponent } from './pages/upsert-workflow/upsert-workflow.component';
import { WorkflowManagementComponent } from './pages/workflow-management/workflow-management.component';
import { AdminWorkflowService } from './services/admin-workflow.service';

export const ADMIN_PROCESSES_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: AdminWorkflowComponent,
        canActivate: [NgxPermissionsGuard],
        data: { permissions: { only: 'VIEW_WORKFLOW', redirectTo: '/' } },
        children: [
          { path: '', component: WorkflowManagementComponent },
          { path: ':workflowId/view', component: UpsertWorkflowComponent },
          {
            path: ':workflowId/edit',
            component: UpsertWorkflowComponent,
            canActivate: [NgxPermissionsGuard],
            data: { edit: true, permissions: { only: 'UPDATE_WORKFLOW', redirectTo: '/' } },
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ADMIN_PROCESSES_ROUTES),
    WorkflowDesignerModule,
    TuiButtonModule,
    TuiIslandModule,
    ReactiveFormsModule,
    FormlyModule,
    LayoutModule,
    TableModule,
    TuiTablePaginationModule,
    TuiLetModule,
    TuiLoaderModule,
    TuiCheckboxModule,
    FormsModule,
    LetModule,
    TranslocoModule,
    TuiLabelModule,
    BaseFormComponentModule,
    TuiHostedDropdownModule,
    TuiComboBoxModule,
    TuiDataListWrapperModule,
    TuiActiveZoneModule,
    TuiDataListModule,
    TuiStringifyContentPipeModule,
  ],
  declarations: [
    AdminWorkflowComponent,
    UpsertWorkflowComponent,
    UpsertStatusDialogComponent,
    UpsertTransitionDialogComponent,
    WorkflowManagementComponent,
    CreateWorkflowDialogComponent,
    AddStatusDropdownButtonComponent,
  ],
  providers: [AdminWorkflowService],
})
export class AdminWorkflowModule {}