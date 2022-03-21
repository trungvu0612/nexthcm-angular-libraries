import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { PermissionDetailComponent } from '../../components/permission-detail/permission-detail.component';
import { Policy } from '../../models/policy';

@Component({
  selector: 'hcm-create-permission',
  templateUrl: './create-permission.component.html',
  styleUrls: ['./create-permission.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePermissionComponent {
  @ViewChild('permission') permission!: PermissionDetailComponent;
  stepper = 0;
  servicesForm = new FormGroup({});
  servicesModel = { policyItems: [{}] } as Partial<Policy>;
  policyForm = new FormGroup({});
  policyModel = {} as Partial<Policy>;

  nextStep() {
    this.permission.updateDataTable();
    this.stepper = 1;
  }
}
