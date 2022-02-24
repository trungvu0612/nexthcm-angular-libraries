import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { WorkflowDesignerComponent } from './workflow-designer.component';

@NgModule({
  imports: [CommonModule],
  declarations: [WorkflowDesignerComponent],
  exports: [WorkflowDesignerComponent],
})
export class WorkflowDesignerModule {}
