import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, Output, ViewChild } from '@angular/core';
import { NextWorkflowStatus, WorkflowStatus } from '@nexthcm/cdk';
import {
  TuiButtonModule,
  TuiDataListModule,
  TuiDropdownControllerModule,
  TuiHostedDropdownComponent,
  TuiHostedDropdownModule,
} from '@taiga-ui/core';

@Component({
  selector: 'hcm-workflow-actions-button-dropdown',
  templateUrl: './workflow-actions-button-dropdown.component.html',
  styleUrls: ['./workflow-actions-button-dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WorkflowActionsButtonDropdownComponent {
  @ViewChild(TuiHostedDropdownComponent) component?: TuiHostedDropdownComponent;
  @Input() items: NextWorkflowStatus[] = [];
  @Output() selectAction = new EventEmitter<WorkflowStatus>();

  open = false;

  onClick(status: WorkflowStatus): void {
    this.open = false;
    this.component?.nativeFocusableElement?.focus();
    this.selectAction.emit(status);
  }
}

@NgModule({
  declarations: [WorkflowActionsButtonDropdownComponent],
  imports: [CommonModule, TuiHostedDropdownModule, TuiDropdownControllerModule, TuiButtonModule, TuiDataListModule],
  exports: [WorkflowActionsButtonDropdownComponent],
})
export class WorkflowActionsButtonDropdownComponentModule {}
