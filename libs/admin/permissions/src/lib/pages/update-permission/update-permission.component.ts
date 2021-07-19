import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PromptComponent } from '@nexthcm/ui';
import { FormGroup } from '@ngneat/reactive-forms';
import { map, switchMap } from 'rxjs/operators';
import { SweetAlertOptions } from 'sweetalert2';
import { PermissionDetailComponent } from '../../components/permission-detail/permission-detail.component';
import { Permission, Policy, PolicyItem, Resource } from '../../models/policy';
import { AdminPermissionsService } from '../../services/admin-permissions.service';

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
  refresh$ = this.adminPermissions.getPermission(this.route.snapshot.params.id).pipe(
    map((policy) => {
      const policyItems: PolicyItem[] = JSON.parse(JSON.stringify(policy.policyItems));
      policyItems.forEach((policyItem) => {
        const actionsId = Array.from(new Set(policyItem.permissions.map((permission) => permission.action.id)));
        const permissions: Permission[] = [];
        policyItem.permissions.forEach((permission) => {
          const index = actionsId.indexOf(permission.action.id);
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

  nextStep(): void {
    if (this.stepperIndex === 1) this.permission.updateDataTable();
    this.stepperIndex += 1;
  }

  submitPolicy(): void {
    if (this.policyForm.valid) {
      this.permission.updatePolicyItems();
      this.adminPermissions
        .editPermission(this.route.snapshot.queryParams.policyId, this.policyModel)
        .pipe(
          switchMap(() => this.prompt.open({ icon: 'success', text: 'Updated successfully!' } as SweetAlertOptions))
        )
        .subscribe(() => this.router.navigateByUrl('admin/permissions'));
    }
  }
}
