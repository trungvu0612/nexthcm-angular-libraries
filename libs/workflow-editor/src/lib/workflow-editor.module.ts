import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WorkflowEditorComponent } from './workflow-editor.component';

@NgModule({
  imports: [CommonModule],
  declarations: [WorkflowEditorComponent],
  exports: [WorkflowEditorComponent],
})
export class WorkflowEditorModule {}
