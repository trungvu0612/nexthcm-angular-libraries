import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AkitaNgEffectsModule } from '@datorama/akita-ng-effects';
import { JobTitlesEffects } from '@nexthcm/cdk';
import {
  BaseFormComponentModule,
  FormlyFieldArraySingleItemComponentModule,
  HEADER_TABS,
  LayoutComponent,
  LayoutModule,
  MenuItem,
} from '@nexthcm/ui';
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
  TuiErrorModule,
  TuiHintModule,
  TuiHostedDropdownModule,
  TuiLabelModule,
  TuiLinkModule,
  TuiLoaderModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiBadgeModule,
  TuiCheckboxLabeledModule,
  TuiCheckboxModule,
  TuiComboBoxModule,
  TuiDataListWrapperModule,
  TuiIslandModule,
  TuiRadioModule,
  TuiSelectModule,
  TuiTabsModule,
  TuiToggleModule,
} from '@taiga-ui/kit';
import { PolymorpheusModule } from '@tinkoff/ng-polymorpheus';
import { TableModule } from 'ngx-easy-table';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';
import { AdminWorkflowsComponent } from './admin-workflows.component';
import { AddConditionToTransitionDialogComponent } from './components/add-condition-to-transition-dialog/add-condition-to-transition-dialog.component';
import { AddPostFunctionToTransitionDialogComponent } from './components/add-post-function-to-transition-dialog/add-post-function-to-transition-dialog.component';
import { AddStatusDropdownButtonComponent } from './components/add-status-button-dropdown/add-status-dropdown-button.component';
import { AddValidatorToTransitionDialogComponent } from './components/add-validator-to-transition-dialog/add-validator-to-transition-dialog.component';
import { InitWorkflowDialogComponent } from './components/create-workflow-dialog/init-workflow-dialog.component';
import { FormlyQuillTemplateVariableComponent } from './components/formly-quill-template-variable/formly-quill-template-variable.component';
import { FormlySelectTransitionOptionComponent } from './components/formly-select-transition-option/formly-select-transition-option.component';
import { StatusComboboxComponent } from './components/status-combobox/status-combobox.component';
import { TransitionConditionListComponent } from './components/transition-condition-list/transition-condition-list.component';
import { TransitionDetailDialogComponent } from './components/transition-detail-dialog/transition-detail-dialog.component';
import { TransitionPostFunctionListComponent } from './components/transition-post-function-list/transition-post-function-list.component';
import { TransitionValidatorListComponent } from './components/transition-validator-list/transition-validator-list.component';
import { UpsertEmailTemplateDialogComponent } from './components/upsert-email-template-dialog/upsert-email-template-dialog.component';
import { UpsertStatusDialogComponent } from './components/upsert-status-dialog/upsert-status-dialog.component';
import { UpsertTransitionDialogComponent } from './components/upsert-transition-dialog/upsert-transition-dialog.component';
import { EmailTemplateManagementComponent } from './pages/email-template-management/email-template-management.component';
import { UpsertWorkflowComponent } from './pages/upsert-workflow/upsert-workflow.component';
import { WorkflowManagementComponent } from './pages/workflow-management/workflow-management.component';
import { TemplateVariable } from './quill/formats/template-variable';
import { AdminWorkflowsService } from './services/admin-workflows.service';
import { EmailTemplatesEffects } from './state/email-templates.effects';
import { EmailTemplatesQuery, EmailTemplatesStore } from './state/email-templates.state';

TemplateVariable.blotName = 'TemplateVariable';
TemplateVariable.tagName = 'span';
Quill.register({ 'formats/TemplateVariable': TemplateVariable });

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
          { path: '', redirectTo: 'list', pathMatch: 'full' },
          { path: 'list', component: WorkflowManagementComponent },
          { path: ':workflowId/view', component: UpsertWorkflowComponent },
          {
            path: ':workflowId/edit',
            component: UpsertWorkflowComponent,
            canActivate: [NgxPermissionsGuard],
            data: { edit: true, permissions: { only: 'UPDATE_WORKFLOW', redirectTo: '/' } },
          },
          {
            path: 'email-templates',
            children: [
              { path: '', component: EmailTemplateManagementComponent },
              { path: 'create', component: UpsertEmailTemplateDialogComponent },
              { path: ':templateId/edit', component: UpsertEmailTemplateDialogComponent },
            ],
          },
        ],
      },
    ],
  },
];

const TABS: MenuItem[] = [
  { label: 'workflows', link: '/admin/workflows/list', permissions: [] },
  {
    label: 'emailTemplates',
    link: '/admin/workflows/email-templates',
    permissions: [],
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
        { name: 'quill-template-variable', component: FormlyQuillTemplateVariableComponent },
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
    PolymorpheusModule,
    QuillModule,
    TuiErrorModule,
    TuiHintModule,
    TuiToggleModule,
    TuiCheckboxLabeledModule,
    AkitaNgEffectsModule.forFeature([EmailTemplatesEffects, JobTitlesEffects]),
    FormlyFieldArraySingleItemComponentModule,
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
    EmailTemplateManagementComponent,
    UpsertEmailTemplateDialogComponent,
    FormlyQuillTemplateVariableComponent,
  ],
  providers: [
    { provide: HEADER_TABS, useValue: TABS },
    AdminWorkflowsService,
    EmailTemplatesStore,
    EmailTemplatesQuery,
  ],
})
export class AdminWorkflowsModule {}
