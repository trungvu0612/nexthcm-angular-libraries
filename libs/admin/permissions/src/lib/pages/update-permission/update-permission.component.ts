import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminPermissionsService } from '../../services/admin-permissions.service';
import { FormGroup } from '@ngneat/reactive-forms';
import { Permission, Policy, PolicyItem, Resource } from '../../models/policy';
import { PromptComponent } from '@nexthcm/ui';
import { PermissionDetailComponent } from '../../components/permission-detail/permission-detail.component';
import { map, switchMap } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'hcm-update-permission',
  templateUrl: './update-permission.component.html',
  styleUrls: ['./update-permission.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdatePermissionComponent {
  @ViewChild('prompt') prompt!: PromptComponent;
  @ViewChild('permission') permission!: PermissionDetailComponent;
  stepperIndex = 0;
  servicesForm = new FormGroup<Partial<Policy>>({});
  servicesModel!: Partial<Policy>;
  policyForm = new FormGroup<Partial<Policy>>({});
  policyModel!: Partial<Policy>;
  refresh$ = this.adminPermissions.getPolicy(this.route.snapshot.queryParams.policyId).pipe(
    map((policy) => {
      const policyItems: PolicyItem[] = JSON.parse(JSON.stringify(policy.policyItems));
      policyItems.forEach((policyItem) => {
        const actionsId = Array.from(new Set(policyItem.permissions.map((permission) => permission.action.actionId)));
        const permissions: Permission[] = [];
        policyItem.permissions.forEach((permission) => {
          const index = actionsId.indexOf(permission.action.actionId);
          const resource = JSON.parse(JSON.stringify(permission.resource));
          if (!permissions[index]) {
            permission.resource = [resource];
            permissions[index] = permission;
          } else (permissions[index].resource as Resource[]).push(resource);
        });
        policyItem.permissions = permissions;
      });
      this.servicesModel = { policyItems };
      this.policyModel = policy;

      return true;
    })
  );

  constructor(
    private adminPermissions: AdminPermissionsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  next(): void {
    if (this.stepperIndex === 1) this.submitServices();
    this.stepperIndex += 1;
  }

  submitServices() {
    this.permission.updateDataTable();
    this.permission.updatePolicyItems();
  }

  updatePolicy(): void {
    this.adminPermissions
      .putPolicy(this.route.snapshot.queryParams.policyId, this.policyModel)
      .pipe(switchMap(() => this.prompt.open({ icon: 'success', text: 'Updated successfully!' } as SweetAlertOptions)))
      .subscribe(() => this.router.navigate(['admin/permissions']));
  }
}
