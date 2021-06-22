import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent, AdminLayoutModule, PromptComponentModule } from '@nexthcm/ui';
import { WorkflowDesignerModule } from '@nexthcm/workflow-designer';
import { FormlyModule } from '@ngx-formly/core';
import { LetModule } from '@rx-angular/template';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { TuiButtonModule, TuiLoaderModule } from '@taiga-ui/core';
import { TuiCheckboxModule, TuiIslandModule } from '@taiga-ui/kit';
import { TableModule } from 'ngx-easy-table';
import { AdminProcessesComponent } from './admin-processes.component';
import { CreateProcessDialogComponent } from './components/create-process-dialog/create-process-dialog.component';
import { UpsertStatusDialogComponent } from './components/upsert-status-dialog/upsert-status-dialog.component';
import { UpsertTransitionDialogComponent } from './components/upsert-transition-dialog/upsert-transition-dialog.component';
import { ProcessesManagementComponent } from './pages/processes-management/processes-management.component';
import { UpsertProcessComponent } from './pages/upsert-process/upsert-process.component';
import { ProcessesService } from './services/processes.service';

export const adminProcessesRoutes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        component: AdminProcessesComponent,
        children: [
          { path: '', component: ProcessesManagementComponent },
          { path: ':processId/edit', component: UpsertProcessComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(adminProcessesRoutes),
    WorkflowDesignerModule,
    TuiButtonModule,
    TuiIslandModule,
    ReactiveFormsModule,
    FormlyModule,
    AdminLayoutModule,
    TableModule,
    TuiTablePaginationModule,
    TuiLetModule,
    TuiLoaderModule,
    TuiCheckboxModule,
    FormsModule,
    LetModule,
    PromptComponentModule,
  ],
  declarations: [
    AdminProcessesComponent,
    UpsertProcessComponent,
    UpsertStatusDialogComponent,
    UpsertTransitionDialogComponent,
    ProcessesManagementComponent,
    CreateProcessDialogComponent,
  ],
  providers: [ProcessesService],
})
export class AdminProcessesModule {}
