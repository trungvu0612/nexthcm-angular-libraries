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
  TuiDropdownControllerModule,
  TuiHostedDropdownModule,
  TuiLabelModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiBadgeModule,
  TuiCheckboxModule,
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiIslandModule,
  TuiRadioModule,
  TuiSelectModule,
  TuiTabsModule,
} from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { AdminWorkflowsComponent } from './admin-workflows.component';
import { AddConditionToTransitionDialogComponent } from './components/add-condition-to-transition-dialog/add-condition-to-transition-dialog.component';
import { AddPostFunctionToTransitionDialogComponent } from './components/add-post-function-to-transition-dialog/add-post-function-to-transition-dialog.component';
import { AddStatusDropdownButtonComponent } from './components/add-status-button-dropdown/add-status-dropdown-button.component';
import { AddValidatorToTransitionDialogComponent } from './components/add-validator-to-transition-dialog/add-validator-to-transition-dialog.component';
import { InitWorkflowDialogComponent } from './components/create-workflow-dialog/init-workflow-dialog.component';
import { FormlySelectTransitionOptionComponent } from './components/formly-select-transition-option/formly-select-transition-option.component';
import { StatusComboboxComponent } from './components/status-combobox/status-combobox.component';
import { TransitionConditionListComponent } from './components/transition-condition-list/transition-condition-list.component';
import { TransitionDetailDialogComponent } from './components/transition-detail-dialog/transition-detail-dialog.component';
import { TransitionPostFunctionListComponent } from './components/transition-post-function-list/transition-post-function-list.component';
import { TransitionValidatorListComponent } from './components/transition-validator-list/transition-validator-list.component';
import { UpsertStatusDialogComponent } from './components/upsert-status-dialog/upsert-status-dialog.component';
import { UpsertTransitionDialogComponent } from './components/upsert-transition-dialog/upsert-transition-dialog.component';
import { UpsertWorkflowComponent } from './pages/upsert-workflow/upsert-workflow.component';
import { WorkflowManagementComponent } from './pages/workflow-management/workflow-management.component';
import { AdminWorkflowsService } from './services/admin-workflows.service';

export const ADMIN_WORKFLOWS_ROUTES: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: AdminWorkflowsComponent,
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
    RouterModule.forChild(ADMIN_WORKFLOWS_ROUTES),
    WorkflowDesignerModule,
    TuiButtonModule,
    TuiIslandModule,
    ReactiveFormsModule,
    FormlyModule.forChild({
      types: [
        { name: 'status-combobox', component: StatusComboboxComponent, wrappers: ['form-field'] },
        {
          name: 'select-transition-option',
          component: FormlySelectTransitionOptionComponent,
          wrappers: ['form-field'],
        },
      ],
    }),
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
    TuiTextfieldControllerModule,
    TuiDropdownControllerModule,
    TuiLinkModule,
    TuiTabsModule,
    TuiBadgeModule,
    TuiRadioModule,
    TuiSelectModule,
  ],
  declarations: [
    AdminWorkflowsComponent,
    UpsertWorkflowComponent,
    UpsertStatusDialogComponent,
    UpsertTransitionDialogComponent,
    WorkflowManagementComponent,
    InitWorkflowDialogComponent,
    AddStatusDropdownButtonComponent,
    StatusComboboxComponent,
    TransitionDetailDialogComponent,
    TransitionConditionListComponent,
    AddConditionToTransitionDialogComponent,
    FormlySelectTransitionOptionComponent,
    AddValidatorToTransitionDialogComponent,
    AddPostFunctionToTransitionDialogComponent,
    TransitionValidatorListComponent,
    TransitionPostFunctionListComponent,
  ],
  providers: [AdminWorkflowsService],
})
export class AdminWorkflowsModule {}
