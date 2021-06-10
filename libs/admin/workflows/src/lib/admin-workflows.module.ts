import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WorkflowEditorModule } from '@nexthcm/workflow-editor';
import { AdminWorkflowsComponent } from './admin-workflows.component';

export const adminWorkflowsRoutes: Routes = [{ path: '', component: AdminWorkflowsComponent }];

@NgModule({
  imports: [CommonModule, RouterModule.forChild(adminWorkflowsRoutes), WorkflowEditorModule],
  declarations: [AdminWorkflowsComponent],
})
export class AdminWorkflowsModule {}
