import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PromptComponent } from '@nexthcm/ui';
import { FormGroup } from '@ngneat/reactive-forms';
import { switchMap } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { PermissionDetailComponent } from '../../components/permission-detail/permission-detail.component';
import { Policy } from '../../models/policy';
import { AdminPermissionsService } from '../../services/admin-permissions.service';

@Component({
  selector: 'hcm-create-permission',
  templateUrl: './create-permission.component.html',
  styleUrls: ['./create-permission.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreatePermissionComponent {
  @ViewChild('prompt') prompt!: PromptComponent;
  @ViewChild('permission') permission!: PermissionDetailComponent;
  stepper = 0;
  servicesForm = new FormGroup<Partial<Policy>>({});
  servicesModel = { policyItems: [{}] } as Partial<Policy>;
  policyForm = new FormGroup<Partial<Policy>>({});
  policyModel = {} as Partial<Policy>;

  constructor(private adminPermissions: AdminPermissionsService, private router: Router) {}

  nextStep() {
    this.permission.updateDataTable();
    this.stepper = 1;
  }

  submitPolicy(): void {
    if (this.policyForm.valid) {
      this.permission.updatePolicyItems();
      this.adminPermissions
        .createPermission(this.policyModel)
        .pipe(
          switchMap(() => this.prompt.open({ icon: 'success', text: 'Created successfully!' } as SweetAlertOptions))
        )
        .subscribe(() => this.router.navigateByUrl('admin/permissions'));
    }
  }
}
