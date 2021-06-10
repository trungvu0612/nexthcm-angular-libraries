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

export const adminProcessesRoutes: Routes = [
  {
    path: '',
    component: AdminProcessesComponent,
    children: [
      { path: 'add', component: UpsertProcessComponent },
      { path: ':workflowId/edit', component: UpsertProcessComponent },
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
  ],
  declarations: [AdminProcessesComponent, UpsertProcessComponent, UpsertStatusDialogComponent],
})
export class AdminProcessesModule {}
