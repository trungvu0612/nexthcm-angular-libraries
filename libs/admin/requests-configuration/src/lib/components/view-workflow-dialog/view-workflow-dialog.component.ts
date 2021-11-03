import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core';
import { WorkflowAPI, WorkflowAPIDefinition } from '@nexthcm/workflow-designer';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'hcm-view-workflow-dialog',
  templateUrl: './view-workflow-dialog.component.html',
  styleUrls: ['./view-workflow-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ViewWorkflowDialogComponent implements AfterViewInit {
  @ViewChild('workflowDesigner') workflowDesigner!: WorkflowAPIDefinition;

  constructor(@Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<unknown, string>) {}

  ngAfterViewInit(): void {
    this.workflowDesigner.apiEvent({ type: WorkflowAPI.decodeXML, value: this.context.data });
  }

  onZoomIn(): void {
    this.workflowDesigner.apiEvent({ type: WorkflowAPI.zoomIn });
  }

  onZoomOut(): void {
    this.workflowDesigner.apiEvent({ type: WorkflowAPI.zoomOut });
  }
}
