import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowEditorModule } from '@nexthcm/workflow-editor';
import { FormlyModule } from '@ngx-formly/core';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiIslandModule } from '@taiga-ui/kit';
import { AdminProcessesComponent } from './admin-processes.component';
import { UpsertStatusDialogComponent } from './components/upsert-status-dialog/upsert-status-dialog.component';
import { UpsertProcessComponent } from './pages/upsert-process/upsert-process.component';
import { UpsertTransitionDialogComponent } from './components/upsert-transition-dialog/upsert-transition-dialog.component';
import { LayoutComponent, LayoutModule } from '@nexthcm/ui';
import { ProcessesManagementComponent } from './pages/processes-management/processes-management.component';
import { TableModule } from 'ngx-easy-table';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { CreateProcessDialogComponent } from './components/create-process-dialog/create-process-dialog.component';

export const adminProcessesRoutes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        component: AdminProcessesComponent,
        children: [
          { path: '', component: ProcessesManagementComponent },
          { path: ':workflowId/edit', component: UpsertProcessComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminProcessesRoutes),
    WorkflowEditorModule,
    TuiButtonModule,
    TuiIslandModule,
    ReactiveFormsModule,
    FormlyModule,
    LayoutModule,
    TableModule,
    TuiTablePaginationModule,
  ],
  declarations: [
    AdminProcessesComponent,
    UpsertProcessComponent,
    UpsertStatusDialogComponent,
    UpsertTransitionDialogComponent,
    ProcessesManagementComponent,
    CreateProcessDialogComponent,
  ],
})
export class AdminProcessesModule {}
