import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hcm-admin-workflows',
  template: ` <hcm-workflow-editor></hcm-workflow-editor> `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminWorkflowsComponent {}
