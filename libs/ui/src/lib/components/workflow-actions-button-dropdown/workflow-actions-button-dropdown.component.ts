import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, NgModule, Output, ViewChild } from '@angular/core';
import { NextWorkflowStatus, WorkflowTransition } from '@nexthcm/cdk';
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
  @Output() selectTransition = new EventEmitter<WorkflowTransition>();

  open = false;

  onClick(transition: WorkflowTransition): void {
    this.open = false;
    this.component?.nativeFocusableElement?.focus();
    this.selectTransition.emit(transition);
  }
}

@NgModule({
  declarations: [WorkflowActionsButtonDropdownComponent],
  imports: [CommonModule, TuiHostedDropdownModule, TuiDropdownControllerModule, TuiButtonModule, TuiDataListModule],
  exports: [WorkflowActionsButtonDropdownComponent],
})
export class WorkflowActionsButtonDropdownComponentModule {}
